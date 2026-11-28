import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";

import { defaultLocale, localesMap } from "./app/config/i18n.config";

const baseUrl = process.env.NUXT_PUBLIC_APP_BASE_URL!;

export default defineNuxtConfig({
	app: {
		layoutTransition: false,
		pageTransition: false,
	},
	colorMode: {
		classSuffix: "",
		dataValue: "ui-color-scheme",
	},
	components: [
		{
			extensions: [".vue"],
			path: fileURLToPath(new URL("./app/components/", import.meta.url)),
			pathPrefix: false,
		},
	],
	css: [
		"@fontsource-variable/inter/standard.css",
		"@fontsource-variable/inter/standard-italic.css",
		fileURLToPath(new URL("./app/styles/index.css", import.meta.url)),
	],
	devtools: {
		enabled: true,
	},
	experimental: {
		componentIslands: {
			selectiveClient: true,
		},
		defaults: {
			useAsyncData: {
				deep: false,
			},
			useFetch: {
				timeout: 250,
			},
		},
		inlineRouteRules: true,
	},
	features: {
		/** @see https://github.com/nuxt/nuxt/issues/21821 */
		inlineStyles: false,
	},
	future: {
		compatibilityVersion: 4,
	},
	i18n: {
		baseUrl,
		defaultLocale,
		detectBrowserLanguage: {
			redirectOn: "root",
		},
		langDir: "messages",
		locales: Object.values(localesMap),
		strategy: "prefix_and_default",
		vueI18n: "i18n.config.ts",
	},
	imports: {
		dirs: ["./config/"],
	},
	modules: ["@nuxt/image", "@nuxtjs/color-mode", "@nuxtjs/i18n", "@nuxtjs/leaflet"],
	nitro: {
		compressPublicAssets: true,
		prerender: {
			routes: ["/manifest.webmanifest", "/robots.txt", "/sitemap.xml"],
		},
	},
	runtimeConfig: {
		public: {
			apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
			appBaseUrl: process.env.NUXT_PUBLIC_APP_BASE_URL,
			bots: process.env.NUXT_PUBLIC_BOTS,
			googleSiteVerification: process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
			iiifBaseUrl: process.env.NUXT_PUBLIC_IIIF_BASE_URL,
			matomoBaseUrl: process.env.NUXT_PUBLIC_MATOMO_BASE_URL,
			matomoId: process.env.NUXT_PUBLIC_MATOMO_ID,
			redmineId: process.env.NUXT_PUBLIC_REDMINE_ID,
		},
	},
	typescript: {
		shim: false,
		strict: true,
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
