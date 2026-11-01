import type { Page } from "@playwright/test";

export async function fillMarkdownEditor(page: Page, markdown: string) {
  const editor = page.getByTestId("markdown-editor");
  await editor.waitFor({ state: "visible" });

  const tagName = await editor.evaluate((node) => node.tagName.toLowerCase());
  if (tagName === "textarea") {
    await editor.fill(markdown);
    return;
  }

  await page.getByText("Loading editor…").waitFor({ state: "hidden" });
  const editable = editor.locator('[contenteditable="true"]').first();
  await editable.click();
  await editable.fill(markdown);
}
