import type { Messages } from "#/app/config/i18n.config.ts";

declare module "vue-i18n" {
	// oxlint-disable-next-line typescript/no-empty-object-type -- Vue I18n augments this interface.
	export interface DefineLocaleMessage extends Messages {}
}
