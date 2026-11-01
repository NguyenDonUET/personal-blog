import { expect, type Page } from "@playwright/test";

export async function loginAsAdmin(page: Page, password: string) {
  await page.goto("/admin");

  if (page.url().includes("/admin/login")) {
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/admin");
  }

  await expect(page.getByRole("heading", { name: "Posts" })).toBeVisible();
}
