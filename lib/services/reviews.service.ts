/**
 * lib/services/reviews.service.ts
 *
 * All Supabase DB operations for the reviews feature.
 * API routes call these functions — they never touch the DB directly.
 */

import { supabaseAdmin } from "../supabase-admin";
import { upsertServiceAnalytics } from "./analytics.service";

// ─── Configuration ────────────────────────────────────────────────────────────

const REVIEW_CONFIG = {
  MAX_COMMENT_LENGTH: 2000,
  MIN_COMMENT_LENGTH: 3,
  MAX_RATING: 5,
  MIN_RATING: 1,
} as const;

// ─── Banned Words & Patterns ────────────────────────────────────────────────

const BANNED_WORDS = [
  // Profanity
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "damn",
  "bastard",
  "cunt",
  "pussy",
  "dick",
  "cock",
  "porn",
  "nude",
  "sex",
  "fag",
  "queer",
  "retard",
  "midget",
  "twat",
  "wanker",
  "bullshit",
  "goddamn",
  "motherfucker",
  "hell",
  "crap",

  // Hate speech
  "racist",
  "sexist",
  "homophobic",
  "transphobic",
  "hate",
  "nazi",
  "kkk",
  "white power",
  "black power",
  "supremacy",
  "terrorist",
  "islamophobic",
  "antisemitic",
  "bigot",
  "bad",
  "worts",
  "don't",

  // Threats & harassment
  "kill",
  "murder",
  "death",
  "threat",
  "attack",
  "rape",
  "molest",
  "abuse",
  "bully",
  "harass",
  "assault",
  "terror",
  "bomb",
  "shoot",
  "stab",

  // Scam indicators
  "scam",
  "fraud",
  "fake",
  "spam",
  "cheat",
  "liar",
  "dishonest",
  "corrupt",
  "bribe",
  "scammer",

  // Personal attacks
  "stupid",
  "idiot",
  "moron",
  "dumb",
  "useless",
  "worthless",
  "pathetic",
  "loser",
  "failure",
];

// Pattern-based filtering (regex) - Fixed version
const FORBIDDEN_PATTERNS = {
  // Phone numbers (10-15 digits)
  PHONE: /\b\d{10,15}\b/,

  // Email addresses
  EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,

  // URLs - Simple pattern that catches most URLs
  URL: /https?:\/\/[^\s]+/,

  // Common URL shorteners and social media - Simplified
  URL_SHORT:
    /(bit\.ly|tinyurl|shorturl|goo\.gl|ow\.ly|is\.gd|buff\.ly|t\.co|rb\.gy|lnkd\.in|youtu\.be|wp\.me|amzn\.to|spoti\.fi|t\.me|whatsapp\.com|wa\.me|ig\.me|tiny\.cc|x\.co|zoom\.us|meet\.google|discord\.gg|slack\.com|trello\.com|notion\.so|airtable\.com|calendly\.com|vimeo\.com|dribbble\.com|behance\.net|github\.com|gitlab\.com|medium\.com|substack\.com|patreon\.com|tiktok\.com|snapchat\.com|telegram\.org|signal\.org|wechat\.com|line\.me|kakao\.com|viber\.com|skype\.com|teamviewer\.com|anydesk\.com|upwork\.com|freelancer\.com|fiverr\.com|topcoder\.com|hackerrank\.com|leetcode\.com|codeforces\.com|kaggle\.com|coursera\.org|udemy\.com|udacity\.com|edx\.org|pluralsight\.com|linkedin\.com|indeed\.com|glassdoor\.com|monster\.com|careerbuilder\.com|ziprecruiter\.com|simplyhired\.com|naukri\.com|timesjobs\.com|shine\.com|foundit\.in)/,

  // Repeated characters (spam detection)
  REPEATED_CHARS: /(.)\1{5,}/,

  // All caps (spam/shouting detection)
  ALL_CAPS: /[A-Z]{10,}/,

  // Multiple punctuation (spam detection)
  REPEATED_PUNCTUATION: /[!?.,]{4,}/,
};

// ─── Type Definitions ────────────────────────────────────────────────────────

export interface ReviewRow {
  id: string;
  service_id: string;
  user_id: string;
  rating: number;
  review: string | null;
  created_at: string;
  updated_at: string;
  users?: { full_name: string; about: string | null } | null;
}

export interface ReviewsResult {
  success: boolean;
  reviews?: ReviewRow[];
  error?: string;
}

export interface PostReviewResult {
  success: boolean;
  message?: string;
  averageRating?: number;
  totalReviews?: number;
  error?: string;
  errorCode?:
    | "NOT_FOUND"
    | "CLIENT_ERROR"
    | "SERVER_ERROR"
    | "INAPPROPRIATE_CONTENT";
  moderationFlags?: string[];
}

export interface ModerationResult {
  isAppropriate: boolean;
  flags: string[];
  sanitizedComment: string;
}

// ─── Content Filtering Functions ────────────────────────────────────────────

/**
 * Check if text contains banned words (case-insensitive)
 */
const containsBannedWords = (text: string): string[] => {
  const lowerText = text.toLowerCase();
  return BANNED_WORDS.filter((word) => {
    // Check for whole word match or partial match
    const regex = new RegExp(`\\b${word}\\b`, "i");
    return regex.test(lowerText) || lowerText.includes(word);
  });
};

/**
 * Check if text contains forbidden patterns
 */
const containsForbiddenPatterns = (text: string): string[] => {
  const found: string[] = [];

  for (const [key, pattern] of Object.entries(FORBIDDEN_PATTERNS)) {
    if (pattern.test(text)) {
      found.push(key);
    }
  }

  return found;
};

/**
 * Sanitize text (remove unwanted characters)
 */
const sanitizeText = (text: string): string => {
  return (
    text
      .trim()
      // Remove multiple spaces
      .replace(/\s+/g, " ")
      // Remove control characters
      .replace(/[\x00-\x1F\x7F]/g, "")
      // Remove zero-width characters
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
  );
};

/**
 * Check if text is mostly spam (low quality)
 */
const isSpam = (text: string): boolean => {
  const trimmed = text.trim();

  // Too short or too long
  if (trimmed.length < REVIEW_CONFIG.MIN_COMMENT_LENGTH) return true;
  if (trimmed.length > REVIEW_CONFIG.MAX_COMMENT_LENGTH) return true;

  // Less than 3 unique words
  const words = trimmed.split(/\s+/);
  const uniqueWords = new Set(words.map((w) => w.toLowerCase()));
  if (uniqueWords.size < 3 && trimmed.length > 10) return true;

  // Contains only numbers or special characters
  if (/^[\d\s\W]+$/.test(trimmed)) return true;

  // Contains repeated characters
  if (/(.)\1{4,}/.test(trimmed)) return true;

  // Contains repeated words
  const wordFrequency: Record<string, number> = {};
  for (const word of words) {
    const lower = word.toLowerCase();
    wordFrequency[lower] = (wordFrequency[lower] || 0) + 1;
    if (wordFrequency[lower] > 3) return true;
  }

  return false;
};

/**
 * Moderate review content for inappropriate content
 */
const moderateContent = (
  comment: string | null | undefined,
): ModerationResult => {
  const flags: string[] = [];

  // If no comment, it's automatically appropriate
  if (!comment) {
    return { isAppropriate: true, flags: [], sanitizedComment: "" };
  }

  // Sanitize first
  const sanitized = sanitizeText(comment);

  // Check for empty after sanitization
  if (!sanitized) {
    return {
      isAppropriate: false,
      flags: ["EMPTY_CONTENT"],
      sanitizedComment: "",
    };
  }

  // Check length
  if (sanitized.length < REVIEW_CONFIG.MIN_COMMENT_LENGTH) {
    flags.push("TOO_SHORT");
  }
  if (sanitized.length > REVIEW_CONFIG.MAX_COMMENT_LENGTH) {
    flags.push("TOO_LONG");
  }

  // Check for banned words
  const bannedWords = containsBannedWords(sanitized);
  if (bannedWords.length > 0) {
    flags.push(
      `BANNED_WORDS: ${bannedWords.slice(0, 3).join(", ")}${bannedWords.length > 3 ? ` +${bannedWords.length - 3} more` : ""}`,
    );
  }

  // Check for forbidden patterns
  const patterns = containsForbiddenPatterns(sanitized);
  if (patterns.length > 0) {
    flags.push(`FORBIDDEN_PATTERNS: ${patterns.join(", ")}`);
  }

  // Check for spam
  if (isSpam(sanitized)) {
    flags.push("SPAM_DETECTED");
  }

  return {
    isAppropriate: flags.length === 0,
    flags,
    sanitizedComment: sanitized,
  };
};

// ─── Service Functions ──────────────────────────────────────────────────────

/**
 * Fetch all reviews for a service, filtering out self-reviews.
 */
export async function getReviews(serviceId: string): Promise<ReviewsResult> {
  if (!supabaseAdmin) {
    return { success: false, error: "Service unavailable" };
  }

  const { data: service } = await supabaseAdmin
    .from("services")
    .select("user_id")
    .eq("id", serviceId)
    .maybeSingle();

  const serviceOwnerId = service?.user_id ?? null;

  const { data: reviews, error } = await supabaseAdmin
    .from("service_ratings")
    .select("*, users:user_id(full_name, about)")
    .eq("service_id", serviceId)
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  const filtered = serviceOwnerId
    ? (reviews ?? []).filter((r) => r.user_id !== serviceOwnerId)
    : (reviews ?? []);

  return { success: true, reviews: filtered as ReviewRow[] };
}

/**
 * Submits a review for a service and updates its rating stats.
 *
 * @param userId - The reviewer
 * @param serviceId - The service being reviewed
 * @param rating - The rating to store
 * @param comment - The optional review text
 * @returns A result indicating whether the review was posted successfully, along with the updated average rating and total review count on success
 */
export async function postReview(
  userId: string,
  serviceId: string,
  rating: number,
  comment?: string | null,
): Promise<PostReviewResult> {
  if (!supabaseAdmin) {
    return { success: false, error: "Service unavailable" };
  }

  // ─── Validate Rating ──────────────────────────────────────────────────────
  if (rating < REVIEW_CONFIG.MIN_RATING || rating > REVIEW_CONFIG.MAX_RATING) {
    return {
      success: false,
      error: `Rating must be between ${REVIEW_CONFIG.MIN_RATING} and ${REVIEW_CONFIG.MAX_RATING}`,
      errorCode: "CLIENT_ERROR",
    };
  }

  // ─── Check Service Exists ────────────────────────────────────────────────
  const { data: service, error: serviceError } = await supabaseAdmin
    .from("services")
    .select("user_id")
    .eq("id", serviceId)
    .maybeSingle();

  if (serviceError) {
    console.error("Database error checking service existence:", serviceError);
    return {
      success: false,
      error: "Failed to submit review. Please try again later.",
      errorCode: "SERVER_ERROR",
    };
  }

  if (!service) {
    return {
      success: false,
      error: "Service listing not found.",
      errorCode: "NOT_FOUND",
    };
  }

  // ─── Prevent Self-Review ─────────────────────────────────────────────────
  if (service.user_id === userId) {
    return {
      success: false,
      error: "You cannot review your own service listing.",
      errorCode: "CLIENT_ERROR",
    };
  }

  // ─── Check for Duplicate Review ──────────────────────────────────────────
  const { data: existingReview } = await supabaseAdmin
    .from("service_ratings")
    .select("id")
    .eq("service_id", serviceId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingReview) {
    return {
      success: false,
      error: "You have already submitted a review for this tutor/service.",
      errorCode: "CLIENT_ERROR",
    };
  }

  // ─── Moderate Content ────────────────────────────────────────────────────
  let finalComment: string | null = null;

  if (comment) {
    const moderation = moderateContent(comment);

    if (!moderation.isAppropriate) {
      return {
        success: false,
        error:
          "Your review contains inappropriate content. Please revise and try again.",
        errorCode: "INAPPROPRIATE_CONTENT",
        moderationFlags: moderation.flags,
      };
    }

    finalComment = moderation.sanitizedComment;
  }

  // ─── Insert Review ───────────────────────────────────────────────────────
  const now = new Date().toISOString();
  const { error: insertError } = await supabaseAdmin
    .from("service_ratings")
    .insert({
      service_id: serviceId,
      user_id: userId,
      rating,
      review: finalComment,
      created_at: now,
      updated_at: now,
    });

  if (insertError) {
    console.error("Insert error:", insertError);
    return {
      success: false,
      error: insertError.message,
      errorCode: "SERVER_ERROR",
    };
  }

  // ─── Recalculate Stats ──────────────────────────────────────────────────
  const { data: allRatings, error: ratingsFetchError } = await supabaseAdmin
    .from("service_ratings")
    .select("rating")
    .eq("service_id", serviceId);

  if (ratingsFetchError) {
    console.error("Error fetching ratings for stats:", ratingsFetchError);
    return {
      success: false,
      error: ratingsFetchError.message,
      errorCode: "SERVER_ERROR",
    };
  }

  const totalReviews = allRatings?.length ?? 0;
  const totalScore = allRatings?.reduce((sum, r) => sum + r.rating, 0) ?? 0;
  const averageRating =
    totalReviews > 0 ? parseFloat((totalScore / totalReviews).toFixed(1)) : 0;

  // ─── Update Service Stats ──────────────────────────────────────────────
  await supabaseAdmin
    .from("services")
    .update({
      rating_average: averageRating,
      reviews_count: totalReviews,
    })
    .eq("id", serviceId);

  await upsertServiceAnalytics({ serviceId, totalReviews, averageRating });

  return {
    success: true,
    message: "Review posted successfully",
    averageRating,
    totalReviews,
  };
}
