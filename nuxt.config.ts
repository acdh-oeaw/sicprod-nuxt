import { fileURLToPath } from "node:url";

import { defaultLocale, localesMap } from "./app/config/i18n.config";

const baseUrl = process.env.NUXT_PUBLIC_APP_BASE_URL!;

export default defineNuxtConfig({
	alias: {
		"@": fileURLToPath(new URL("./app/", import.meta.url)),
		"~": fileURLToPath(new URL("./", import.meta.url)),
	},
	app: {
		layoutTransition: false,
		pageTransition: false,
	},
	colorMode: {
		classSuffix: "",
		dataValue: "ui-color-scheme",
	},
	components: [{ extensions: [".vue"], path: "@/components", pathPrefix: false }],
	content: {
		defaultLocale,
		locales: Object.keys(localesMap),
	},
	css: [
		"@fontsource-variable/inter/standard.css",
		"@fontsource-variable/inter/standard-italic.css",
		"tailwindcss/tailwind.css",
		"@/styles/index.css",
	],
	devtools: {
		enabled: true,
	},
	eslint: {
		config: {
			autoInit: false,
			standalone: true,
		},
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
		langDir: "../i18n/messages",
		lazy: true,
		locales: Object.values(localesMap),
		strategy: "prefix_and_default",
		vueI18n: "./i18n/i18n.config.ts",
	},
	imports: {
		dirs: ["./config/"],
	},
	modules: [
		"@nuxt/content",
		"@nuxt/eslint",
		"@nuxt/image",
		"@nuxtjs/color-mode",
		"@nuxtjs/i18n",
		"@nuxtjs/leaflet",
		"@vueuse/nuxt",
	],
	nitro: {
		compressPublicAssets: true,
		prerender: {
			routes: ["/manifest.webmanifest", "/robots.txt", "/sitemap.xml"],
		},
	},
	postcss: {
		plugins: {
			tailwindcss: {},
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
		// https://github.com/nuxt/nuxt/issues/14816#issuecomment-1484918081
		tsConfig: {
			compilerOptions: {
				baseUrl: ".",
				paths: {
					"@/*": ["./app/*"],
					"~/*": ["./*"],
				},
			},
		},
	},
});
