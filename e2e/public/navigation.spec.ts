import { test, expect } from "@playwright/test";

test.describe("Public navigation", () => {
  test("main nav links reach core pages", async ({ page }) => {
    await page.goto("/");

    const mainNav = page.getByRole("navigation", { name: "Main" });

    await mainNav.getByRole("link", { name: "Blog" }).click();
    await expect(page).toHaveURL("/blog");
    await expect(page.getByRole("heading", { name: "My Articles" })).toBeVisible();

    await mainNav.getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL("/about");
    await expect(page.getByRole("heading", { name: "About Me" })).toBeVisible();

    await mainNav.getByRole("link", { name: "Newsletter" }).click();
    await expect(page).toHaveURL("/newsletter");
    await expect(page.getByRole("heading", { name: "Newsletter" })).toBeVisible();

    await mainNav.getByRole("link", { name: "Home" }).click();
    await expect(page).toHaveURL("/");
    await expect(
      page.getByRole("heading", { name: "Latest Articles" }),
    ).toBeVisible();
  });

  test("skip link moves focus to main content", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Skip to content" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
  });
});
