import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

export const publicRoutes = [
  "/",
  "/blog",
  "/blog/balancing-hobbies-and-coding",
  "/about",
  "/newsletter",
];

export type ColorScheme = "light" | "dark";

/**
 * The theme store defaults to "system", so emulating the OS color scheme is
 * enough to render either theme without clicking the toggle.
 */
export async function gotoWithTheme(page: Page, path: string, scheme: ColorScheme) {
  await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
  await page.goto(path);
  await expect(page.locator("html[data-theme-ready='true']")).toBeAttached();
  await expect
    .poll(() => page.locator("html").evaluate((el) => el.classList.contains("dark")))
    .toBe(scheme === "dark");
  // Color transitions would let axe sample a half-faded color.
  await page.addStyleTag({
    content: "*, *::before, *::after { transition: none !important; animation: none !important; }",
  });
}

export async function expectNoAxeViolations(page: Page, rules: string[], include?: string) {
  let builder = new AxeBuilder({ page }).withRules(rules);
  if (include) builder = builder.include(include);
  const { violations } = await builder.analyze();

  const report = violations.flatMap((violation) =>
    violation.nodes.map(
      (node) => `[${violation.id}] ${node.target.join(" ")}\n  ${node.failureSummary}`,
    ),
  );
  expect(report, report.join("\n\n")).toEqual([]);
}
