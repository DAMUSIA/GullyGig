/**
 * URL Utility - Centralized URL generation for the application
 * Never hardcode domains. Always use the current origin.
 */

const UUID_REGEX =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

/**
 * Get the base URL of the current deployment
 * Works in both client and server components
 */
export function getBaseUrl(): string {
  // Client-side: use window.location.origin
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Server-side: use environment variable with fallback
  // This should only be used for SSR/API routes
  const serverUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (serverUrl) {
    return serverUrl;
  }

  // Fallback for build time (should rarely be used)
  console.warn(
    "No base URL found, using fallback. This may cause issues in production.",
  );
  return "https://gullygig.in";
}

/**
 * Builds the portfolio URL for a service.
 *
 * @param serviceId - The service identifier used in the URL
 * @param title - The title used to generate a slugged portfolio path
 * @returns The portfolio URL
 */
export function getPortfolioUrl(serviceId: string, title?: string): string {
  if (title) {
    const slugified = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const slug = slugified ? `${slugified}-${serviceId}` : serviceId;
    return `${getBaseUrl()}/p/${slug}`;
  }
  return `${getBaseUrl()}/p/${serviceId}`;
}

/**
 * Resolves a portfolio identifier from a route param, slug, or full URL.
 * This keeps QR scans and shared links working even when the scanner opens
 * a slugged path such as /p/photography-<service-id>.
 */
export function resolvePortfolioIdFromParam(value: string): string | null {
  if (!value) return null;

  const trimmed = value.trim();
  let path = trimmed;

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      path = new URL(trimmed).pathname;
    } catch {
      path = trimmed;
    }
  }

  const segments = path.split("/").filter(Boolean);
  const candidate =
    segments[0] === "p" ? segments.slice(1).join("/") : segments.join("/");
  const normalized = candidate.split("?")[0].split("#")[0];

  const uuidMatch = normalized.match(UUID_REGEX);
  if (uuidMatch?.[0]) {
    return uuidMatch[0];
  }

  return null;
}

/**
 * Get the full profile URL for a user
 */
export function getProfileUrl(userId: string): string {
  return `${getBaseUrl()}/profile/${userId}`;
}

/**
 * Get the full service URL
 */
export function getServiceUrl(serviceId: string, slug?: string): string {
  if (slug) {
    return `${getBaseUrl()}/service/${serviceId}/${slug}`;
  }
  return `${getBaseUrl()}/service/${serviceId}`;
}

/**
 * Get a shareable URL for any path
 */
export function getShareUrl(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getBaseUrl()}${normalizedPath}`;
}

/**
 * Get the poster URL for a service
 */
export function getPosterUrl(serviceId: string): string {
  return `${getBaseUrl()}/poster/${serviceId}`;
}

/**
 * Get the QR code URL for any data
 */
export function getQRCodeUrl(data: string, size: number = 150): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
}

/**
 * Extracts a YouTube Video ID from any standard YouTube URL (watch, embed, shorts, youtu.be)
 */
export function getYouTubeVideoId(url?: string | null): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Check if it's already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Robust regex covering watch?v=, embed/, shorts/, live/, youtu.be/, etc.
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|live\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i,
  );
  if (match && match[1]) {
    return match[1];
  }

  // Fallback query string search for ?v= or &v=
  const fallbackMatch = trimmed.match(/[?&]v=([^&#]+)/);
  if (fallbackMatch && fallbackMatch[1] && fallbackMatch[1].length === 11) {
    return fallbackMatch[1];
  }

  return null;
}

/**
 * Generates a clean, privacy-friendly YouTube embed URL for iframe players
 */
export function getYouTubeEmbedUrl(url?: string | null): string | null {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;
}

