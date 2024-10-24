import { fileURLToPath } from "node:url";

import { defaultLocale, localesMap } from "./config/i18n.config";

const baseUrl = process.env.NUXT_PUBLIC_APP_BASE_URL!;

export default defineNuxtConfig({
	alias: {
		"@": fileURLToPath(new URL("./", import.meta.url)),
	},
	app: {
		layoutTransition: false,
		pageTransition: false,
	},
	colorMode: {
		classSuffix: "",
		dataValue: "ui-color-scheme",
	},
	components: [{ path: "@/components", extensions: [".vue"], pathPrefix: false }],
	content: {
		defaultLocale,
		locales: Object.keys(localesMap),
		markdown: {},
	},
	css: [
		"@fontsource-variable/inter/standard.css",
		"@fontsource-variable/inter/standard-italic.css",
		"tailwindcss/tailwind.css",
		"@/styles/index.css",
	],
	devtools: {
		enabled: process.env.NODE_ENV === "development",
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
	i18n: {
		baseUrl,
		defaultLocale,
		detectBrowserLanguage: {
			redirectOn: "root",
		},
		langDir: "./messages",
		lazy: true,
		locales: Object.values(localesMap),
		strategy: "prefix",
		vueI18n: "./i18n.config.ts",
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
			failOnError: false,
		},
	},
	plugins: ["@/plugins/query-client.ts", "@/plugins/api.ts"],
	postcss: {
		plugins: {
			tailwindcss: {},
		},
	},
	runtimeConfig: {
		NODE_ENV: process.env.NODE_ENV,
		public: {
			NUXT_PUBLIC_API_BASE_URL: process.env.NUXT_PUBLIC_API_BASE_URL,
			NUXT_PUBLIC_APP_BASE_URL: process.env.NUXT_PUBLIC_APP_BASE_URL,
			NUXT_PUBLIC_BOTS: process.env.NUXT_PUBLIC_BOTS,
			NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION: process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
			NUXT_PUBLIC_MATOMO_BASE_URL: process.env.NUXT_PUBLIC_MATOMO_BASE_URL,
			NUXT_PUBLIC_MATOMO_ID: process.env.NUXT_PUBLIC_MATOMO_ID,
			NUXT_PUBLIC_REDMINE_ID: process.env.NUXT_PUBLIC_REDMINE_ID,
		},
	},
	typescript: {
		shim: false,
		strict: true,
		// https://github.com/nuxt/nuxt/issues/14816#issuecomment-1484918081
		tsConfig: {
			compilerOptions: {
				paths: {
					"@/*": ["./*"],
					"~/*": ["./*"],
				},
			},
		},
	},
});
