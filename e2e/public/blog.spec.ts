import { test, expect } from "@playwright/test";

test.describe("Blog reading", () => {
  test("blog index lists seeded article and opens detail page", async ({
    page,
  }) => {
    await page.goto("/blog");

    const articleLink = page.getByRole("link", {
      name: /Balancing Hobbies and Coding/i,
    });
    await expect(articleLink).toBeVisible();
    await Promise.all([
      page.waitForURL("**/blog/balancing-hobbies-and-coding"),
      articleLink.click(),
    ]);
    await expect(
      page.getByRole("heading", {
        name: /Balancing Hobbies and Coding/i,
      }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Why Balance Matters" })).toBeVisible();
  });

  test("home shows latest articles section", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Latest Articles" }),
    ).toBeVisible();
    await expect(page.getByText("Loading articles…")).not.toBeVisible({
      timeout: 20_000,
    });
    await expect(page.locator("#main-content").getByRole("link").first()).toBeVisible();
  });
});
