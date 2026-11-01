import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "../helpers/auth";
import { fillMarkdownEditor } from "../helpers/editor";

const adminPassword = process.env.ADMIN_PASSWORD;
const hasAdminEnv = Boolean(process.env.MONGODB_URI && adminPassword);

test.describe("Admin post preview", () => {
  test.skip(!adminPassword, "ADMIN_PASSWORD is required.");

  test("shows a live preview beside the editor on wide screens", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await loginAsAdmin(page, adminPassword!);
    await page.goto("/admin/posts/new");

    const editor = page.getByTestId("markdown-editor");
    const preview = page.getByTestId("post-preview");

    await expect(page.getByRole("tab")).toHaveCount(0);
    await expect(preview).toContainText("Nothing to preview yet");

    await page.getByLabel("Title").fill("Live title");
    await fillMarkdownEditor(page, "## Live section");
    await expect(preview.getByRole("heading", { level: 1, name: "Live title" })).toBeVisible();
    await expect(preview.getByRole("heading", { level: 2, name: "Live section" })).toBeVisible();

    const editorBox = await editor.boundingBox();
    const previewBox = await preview.boundingBox();
    expect(previewBox!.x).toBeGreaterThan(editorBox!.x + editorBox!.width);
    expect(Math.abs(previewBox!.y - editorBox!.y)).toBeLessThan(2);
  });

  test("switches between write and preview tabs on small screens", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loginAsAdmin(page, adminPassword!);
    await page.goto("/admin/posts/new");

    const previewTab = page.getByRole("tab", { name: "Preview" });
    const preview = page.getByTestId("post-preview");

    await previewTab.click();
    await expect(preview).toContainText("Nothing to preview yet");

    await page.getByRole("tab", { name: "Write" }).click();
    await page.getByLabel("Title").fill("Preview title");
    await page.getByLabel("Description").fill("Preview description");
    await fillMarkdownEditor(page, "## Preview section\n\n- First item");

    await previewTab.click();
    await expect(previewTab).toHaveAttribute("aria-selected", "true");
    await expect(preview.getByRole("heading", { level: 1, name: "Preview title" })).toBeVisible();
    await expect(preview.getByText("Preview description")).toBeVisible();
    await expect(preview.getByRole("heading", { level: 2, name: "Preview section" })).toBeVisible();
    await expect(preview.getByRole("listitem")).toHaveText("First item");

    await page.getByRole("tab", { name: "Write" }).click();
    await expect(page.getByTestId("markdown-editor")).toHaveValue("## Preview section\n\n- First item");
  });
});

test.describe("Admin post CRUD", () => {
  test.skip(!hasAdminEnv, "MONGODB_URI and ADMIN_PASSWORD are required.");

  test("creates, updates, and deletes a post", async ({ page }) => {
    const slug = `e2e-playwright-${Date.now()}`;
    const title = `E2E Playwright ${Date.now()}`;
    const updatedTitle = `${title} (edited)`;

    await loginAsAdmin(page, adminPassword!);

    await page.getByRole("link", { name: "New post" }).click();
    await expect(page.getByRole("heading", { name: "New post" })).toBeVisible();
    await expect(page.getByTestId("markdown-editor")).toBeVisible();

    await page.getByLabel("Title").fill(title);
    await page.getByLabel("Slug").fill(slug);
    await page.getByLabel("Description").fill("Created by Playwright e2e.");
    await fillMarkdownEditor(page, "## E2E section\n\nHello from Playwright.");

    await page.getByTestId("post-submit").click();
    await page.waitForURL("**/admin");

    await page.goto(`/blog/${slug}`);
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
    await expect(page.getByRole("heading", { name: "E2E section" })).toBeVisible();

    await loginAsAdmin(page, adminPassword!);
    await page
      .getByRole("row")
      .filter({ hasText: slug })
      .getByRole("link", { name: "Edit" })
      .click();
    await page.getByLabel("Title").fill(updatedTitle);
    await page.getByTestId("post-submit").click();
    await page.waitForURL("**/admin");

    await page.goto(`/blog/${slug}`);
    await expect(page.getByRole("heading", { name: updatedTitle })).toBeVisible();

    await loginAsAdmin(page, adminPassword!);
    await page
      .getByRole("row")
      .filter({ hasText: slug })
      .getByRole("button", { name: "Delete" })
      .click();
    await page.getByRole("button", { name: "Delete" }).last().click();
    await page.waitForURL("**/admin");

    await loginAsAdmin(page, adminPassword!);
    await expect(page.getByRole("row").filter({ hasText: slug })).toHaveCount(0);
  });
});
