import { defaultLocale } from "@/config/i18n.config";
import { expect, test } from "~/e2e/lib/test";

/**
 * We use `prefix_and_default` i18n routing strategy, because this app was originally published
 * in both "de" and "en" (which was removed shortly thereafter).
 *
 * We want unprefixed routes to be canonical, but prefixed routes still need to resolve, because
 * they have been bookmarked by researchers already, and may also be indexed by google already.
 */
test.describe("i18n", () => {
	test("should serve routes both with and without locale prefix", async ({ page, createI18n }) => {
		const { t } = await createI18n(defaultLocale);

		await page.goto("/search/persons");
		await expect(page.getByRole("heading", { level: 1 })).toContainText(
			t("SearchPersonsPage.title"),
		);

		await page.goto("/de/search/persons");
		await expect(page.getByRole("heading", { level: 1 })).toContainText(
			t("SearchPersonsPage.title"),
		);
	});
});
