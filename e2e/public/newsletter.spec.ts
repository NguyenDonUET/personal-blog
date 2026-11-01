import { test, expect } from "@playwright/test";

test.describe("Newsletter form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/newsletter");
    await expect(
      page.locator('[data-testid="newsletter-form"][data-hydrated="true"]'),
    ).toBeVisible();
  });

  test("shows error when email is empty", async ({ page }) => {
    await page.getByTestId("newsletter-form").getByRole("button", { name: "Stay updated" }).click();
    await expect(page.getByTestId("newsletter-feedback")).toHaveText(/required/i);
  });

  test("shows error for invalid email format", async ({ page }) => {
    await page.getByLabel("Email Address").fill("not-an-email");
    await page.getByTestId("newsletter-form").getByRole("button", { name: "Stay updated" }).click();
    await expect(page.getByTestId("newsletter-feedback")).toHaveText(/valid email/i);
  });

  test("shows success for valid email", async ({ page }) => {
    await page.getByLabel("Email Address").fill("reader@example.com");
    await page.getByTestId("newsletter-form").getByRole("button", { name: "Stay updated" }).click();
    await expect(page.getByTestId("newsletter-feedback")).toHaveText(/subscribing/i);
  });
});
