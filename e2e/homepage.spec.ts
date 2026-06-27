import { test, expect } from "@playwright/test";

test.describe("GullyGig Landing Page E2E Tests", () => {
  test("should load the homepage and check main content", async ({ page }) => {
    // Navigate to homepage
    await page.goto("/");

    // Verify main title is visible and contains expected text
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    await expect(heading).toContainText("Find Trusted Local");
    await expect(heading).toContainText("Skilled Workers");

    // Verify the rating rating section is present
    await expect(page.locator("text=Verified").first()).toBeVisible();
  });

  test("should navigate to register page when clicking Register Now", async ({
    page,
  }) => {
    await page.goto("/");

    // Locate the 'Register Now' CTA link and click it
    const ctaButton = page.locator('a:has-text("Register Now")').first();
    await expect(ctaButton).toBeVisible();
    await ctaButton.click();

    // Verify redirect to register page
    await expect(page).toHaveURL(/\/Auth\?mode=register/);

    // Verify form is visible
    await expect(page.locator('h2:has-text("Sign Up")')).toBeVisible();
  });
});
