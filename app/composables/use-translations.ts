import type { Locale, Schema } from "#/app/config/i18n.config.ts";

export function useTranslations() {
	const { t } = useI18n<Schema, Locale>();

	return t;
}
