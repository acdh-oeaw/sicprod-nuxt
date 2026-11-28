import { defaultLocale } from "#/app/config/i18n.config.ts";

export default defineI18nConfig(() => {
	return {
		fallbackLocale: defaultLocale,
		legacy: false,
	};
});
