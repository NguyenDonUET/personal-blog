import { expect, test, type Page } from "@playwright/test";
import { expectNoAxeViolations, gotoWithTheme, publicRoutes } from "../helpers/a11y";

/** WCAG 1.4.12 Text Spacing: the minimum overrides users must be able to apply. */
const textSpacingOverride = `
  * {
    line-height: 1.5 !important;
    letter-spacing: 0.12em !important;
    word-spacing: 0.16em !important;
  }
  p { margin-bottom: 2em !important; }
`;

/**
 * Tailwind spacing is multiples of 0.25rem, and shadcn uses half-steps (`px-2.5`, `gap-1.5`),
 * so anything off a 2px grid usually comes from an arbitrary class like `p-[13px]`.
 */
const SPACING_STEP_PX = 2;

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

async function clippedTextElements(page: Page) {
  return page.evaluate(() => {
    const clipping = new Set(["hidden", "clip"]);
    const results: string[] = [];

    for (const el of document.querySelectorAll<HTMLElement>("body *")) {
      const style = getComputedStyle(el);
      if (!clipping.has(style.overflowX) && !clipping.has(style.overflowY)) continue;
      if (!el.innerText?.trim()) continue;
      // Visually hidden (sr-only) text is meant to be clipped.
      if (el.clientWidth <= 1 || el.clientHeight <= 1) continue;

      const clippedY = clipping.has(style.overflowY) && el.scrollHeight > el.clientHeight + 1;
      const clippedX = clipping.has(style.overflowX) && el.scrollWidth > el.clientWidth + 1;
      if (clippedY || clippedX) {
        const label = el.innerText.trim().slice(0, 40).replace(/\s+/g, " ");
        results.push(`<${el.tagName.toLowerCase()} class="${el.className}"> "${label}"`);
      }
    }
    return results;
  });
}

async function offScaleSpacing(page: Page, step: number) {
  return page.evaluate((step) => {
    const properties = [
      "paddingTop",
      "paddingRight",
      "paddingBottom",
      "paddingLeft",
      "marginTop",
      "marginBottom",
      "rowGap",
      "columnGap",
    ] as const;
    const results: string[] = [];

    for (const el of document.querySelectorAll<HTMLElement>("header, main, footer, header *, main *, footer *")) {
      const style = getComputedStyle(el);
      if (style.display === "none") continue;

      for (const property of properties) {
        const px = Number.parseFloat(style[property]);
        if (!Number.isFinite(px) || px === 0) continue;
        const remainder = Math.abs(px) % step;
        if (remainder > 0.5 && step - remainder > 0.5) {
          results.push(`<${el.tagName.toLowerCase()} class="${el.className}"> ${property}: ${style[property]}`);
        }
      }
    }
    return results;
  }, step);
}

test.describe("Spacing and layout", () => {
  for (const route of publicRoutes) {
    test.describe(route, () => {
      test("reflows at 320px without horizontal scrolling (WCAG 1.4.10)", async ({ page }) => {
        await page.setViewportSize({ width: 320, height: 640 });
        await gotoWithTheme(page, route, "light");
        expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
      });

      test("survives user text-spacing overrides (WCAG 1.4.12)", async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 800 });
        await gotoWithTheme(page, route, "light");
        await page.addStyleTag({ content: textSpacingOverride });

        expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
        const clipped = await clippedTextElements(page);
        expect(clipped, clipped.join("\n")).toEqual([]);
      });

      test("interactive targets are at least 24x24px (WCAG 2.5.8)", async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 800 });
        await gotoWithTheme(page, route, "light");
        await expectNoAxeViolations(page, ["target-size"]);
      });

      test(`padding, margin and gap stay on the ${SPACING_STEP_PX}px scale`, async ({ page }) => {
        await gotoWithTheme(page, route, "light");
        const offScale = await offScaleSpacing(page, SPACING_STEP_PX);
        expect(offScale, offScale.join("\n")).toEqual([]);
      });
    });
  }
});
