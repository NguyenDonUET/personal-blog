import { expect, test, type Page } from "@playwright/test";
import { expectNoAxeViolations, gotoWithTheme, publicRoutes, type ColorScheme } from "../helpers/a11y";
import { loginAsAdmin } from "../helpers/auth";
import { fillMarkdownEditor } from "../helpers/editor";

const schemes: ColorScheme[] = ["light", "dark"];
const adminPassword = process.env.ADMIN_PASSWORD;

const previewMarkdown = [
  "## Section heading",
  "",
  "A paragraph with **bold**, *italic*, `inline code` and a [link](https://example.com).",
  "",
  "> A blockquote.",
  "",
  "- List item",
  "",
  "```",
  "const code = true;",
  "```",
].join("\n");

/**
 * axe only checks text, so icon contrast (WCAG 1.4.11, 3:1) is measured directly:
 * the SVG's computed `color` against its ancestors' backgrounds composited together.
 */
async function iconContrastRatios(page: Page, selector: string) {
  return page.locator(selector).evaluateAll((svgs) => {
    type Rgba = [number, number, number, number];
    const parse = (value: string): Rgba => {
      const ctx = document.createElement("canvas").getContext("2d")!;
      ctx.fillStyle = value;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
      return [r, g, b, a / 255];
    };
    const over = (top: Rgba, bottom: Rgba): Rgba => [
      top[0] * top[3] + bottom[0] * (1 - top[3]),
      top[1] * top[3] + bottom[1] * (1 - top[3]),
      top[2] * top[3] + bottom[2] * (1 - top[3]),
      1,
    ];
    const luminance = ([r, g, b]: Rgba) => {
      const channel = (c: number) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
    };

    return svgs
      .filter((svg) => svg.getBoundingClientRect().width > 0)
      .map((svg) => {
        const layers: Rgba[] = [];
        for (let el: Element | null = svg.parentElement; el; el = el.parentElement) {
          const bg = parse(getComputedStyle(el).backgroundColor);
          if (bg[3] > 0) layers.push(bg);
          if (bg[3] === 1) break;
        }
        const background = layers.reduceRight<Rgba>((acc, layer) => over(layer, acc), [255, 255, 255, 1]);
        const foreground = over(parse(getComputedStyle(svg).color), background);
        const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
        const label = svg.closest("a, button")?.getAttribute("aria-label") ?? "icon";
        return { label, ratio: Math.round(((light + 0.05) / (dark + 0.05)) * 100) / 100 };
      });
  });
}

for (const scheme of schemes) {
  test.describe(`Color contrast (WCAG AA, ${scheme} theme)`, () => {
    test("header and footer icons have at least 3:1 contrast", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 800 });
      await gotoWithTheme(page, "/", scheme);

      const icons = await iconContrastRatios(page, "header svg, footer svg");
      expect(icons.map((icon) => icon.label).sort()).toEqual(
        ["GitHub", "LinkedIn", "Open menu", "Toggle color theme", "X"].sort(),
      );
      for (const icon of icons) {
        expect(icon.ratio, `${icon.label} icon contrast`).toBeGreaterThanOrEqual(3);
      }
    });

    for (const route of [...publicRoutes, "/admin/login"]) {
      test(route, async ({ page }) => {
        await gotoWithTheme(page, route, scheme);
        await expectNoAxeViolations(page, ["color-contrast"]);
      });
    }

    test("admin new post: editor and live preview", async ({ page }) => {
      test.skip(!adminPassword, "ADMIN_PASSWORD is required.");

      await page.setViewportSize({ width: 1280, height: 900 });
      await loginAsAdmin(page, adminPassword!);
      await gotoWithTheme(page, "/admin/posts/new", scheme);
      await page.getByLabel("Title").fill("Contrast check");
      await page.getByLabel("Description").fill("Description text in the header.");
      await fillMarkdownEditor(page, previewMarkdown);
      await page.getByTestId("post-preview").getByRole("heading", { name: "Section heading" }).waitFor();
      await expectNoAxeViolations(page, ["color-contrast"]);
    });
  });
}
