/**
 * lib/validation.ts
 *
 * Zod schemas for all API route request bodies.
 * Import these in API routes to validate incoming data.
 */

import { z } from "zod";

// ─── Auth / Signup ────────────────────────────────────────────────────────────

export const SignupSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be at most 100 characters")
    .trim(),
  phoneNo: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .max(20, "Phone number must be at most 20 characters")
    .regex(/^[+\d\s\-()]+$/, "Invalid phone number format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .max(254, "Email must be at most 254 characters")
    .optional()
    .or(z.literal("")),
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format")
    .optional(),
  location: z
    .string()
    .max(200, "Location must be at most 200 characters")
    .optional(),
});

export type SignupInput = z.infer<typeof SignupSchema>;

// ─── Likes ────────────────────────────────────────────────────────────────────

export const LikeSchema = z.object({
  serviceId: z.string().uuid("serviceId must be a valid UUID"),
  action: z.enum(["like", "unlike"], {
    errorMap: () => ({ message: "action must be 'like' or 'unlike'" }),
  }),
});

export type LikeInput = z.infer<typeof LikeSchema>;

// ─── Reviews ──────────────────────────────────────────────────────────────────

export const ReviewSchema = z.object({
  serviceId: z.string().uuid("serviceId must be a valid UUID"),
  rating: z
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  comment: z
    .string()
    .max(2000, "Comment must be at most 2000 characters")
    .optional()
    .nullable(),
});

export type ReviewInput = z.infer<typeof ReviewSchema>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Format a ZodError's issues into a single readable string.
 */
export function formatZodError(error: z.ZodError): string {
  return error.issues.map((i) => i.message).join("; ");
}
