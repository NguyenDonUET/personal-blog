import { test, expect } from "@playwright/test";

test.describe("Theme toggle", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem("personal-blog-theme");
    });
  });

  test("toggles dark class on the document root", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html[data-theme-ready='true']")).toBeAttached();

    const root = page.locator("html");
    const toggle = page.getByRole("button", { name: "Toggle color theme" });

    await expect(toggle).toBeVisible();

    const before = await root.evaluate((el) => el.classList.contains("dark"));
    await toggle.click();
    await expect
      .poll(async () => root.evaluate((el) => el.classList.contains("dark")))
      .not.toBe(before);

    const mid = await root.evaluate((el) => el.classList.contains("dark"));
    await toggle.click();
    await expect
      .poll(async () => root.evaluate((el) => el.classList.contains("dark")))
      .toBe(before);
    expect(mid).not.toBe(before);
  });
});
