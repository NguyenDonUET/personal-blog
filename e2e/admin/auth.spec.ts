import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../helpers/auth";

const adminPassword = process.env.ADMIN_PASSWORD;

test.describe("Admin authentication", () => {
  test("redirects unauthenticated users to login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL("/admin/login");
  });

  test("rejects invalid password", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("Password").fill("wrong-password");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText(/invalid password/i)).toBeVisible();
    await expect(page).toHaveURL("/admin/login");
  });

  test("logs in with valid password", async ({ page }) => {
    test.skip(!adminPassword, "ADMIN_PASSWORD is required for admin e2e tests.");

    await loginAsAdmin(page, adminPassword!);
    await expect(page.getByRole("heading", { name: "Posts" })).toBeVisible();
    await expect(page.getByRole("link", { name: "New post" })).toBeVisible();
  });
});
