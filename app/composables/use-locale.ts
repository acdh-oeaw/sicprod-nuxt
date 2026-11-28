import type { Locale, Schema } from "#/app/config/i18n.config.ts";

export function useLocale() {
	const { locale } = useI18n<Schema, Locale>();

	return locale;
}
