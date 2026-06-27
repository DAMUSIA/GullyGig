/**
 * URL Utility - Centralized URL generation for the application
 * Never hardcode domains. Always use the current origin.
 */

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
