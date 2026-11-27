import type { Locale, Messages } from "@/config/i18n.config";

declare module "@intlify/core" {
	interface IntlifyGeneratedTypeConfig {
		locale: Locale;
	}
}

declare module "vue-i18n" {
	// oxlint-disable-next-line typescript/no-empty-object-type -- Vue I18n augments this interface.
	export interface DefineLocaleMessage extends Messages {}
}
