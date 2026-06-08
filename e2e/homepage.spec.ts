import { test, expect } from "@playwright/test";

test.describe("LocalSkill Connect Landing Page E2E Tests", () => {
  test("should load the homepage and check main content", async ({ page }) => {
    // Navigate to homepage
    await page.goto("/");

    // Verify main title is visible and contains expected text
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    await expect(heading).toContainText("Empower Your Skills");
    await expect(heading).toContainText("Earn Locally");

    // Verify the rating rating section is present
    await expect(page.locator("text=Community Rating")).toBeVisible();
  });

  test("should navigate to register page when clicking Join as Provider", async ({
    page,
  }) => {
    await page.goto("/");

    // Locate the 'Join as Provider' CTA link and click it
    const ctaButton = page.locator('a:has-text("Join as Provider")').first();
    await expect(ctaButton).toBeVisible();
    await ctaButton.click();

    // Verify redirect to register page
    await expect(page).toHaveURL(/\/register/);

    // Verify form is visible
    await expect(page.locator('h2:has-text("Sign Up")')).toBeVisible();
  });
});
