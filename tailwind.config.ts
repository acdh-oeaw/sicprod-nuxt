import { createPreset } from "@acdh-oeaw/tailwindcss-preset";
import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const preset = createPreset();

const config = {
	content: [
		"./app.vue",
		"./error.vue",
		"./components/**/*.@(css|ts|vue)",
		"./content/**/*.md",
		"./layouts/**/*.@(css|ts|vue)",
		"./pages/**/*.@(css|ts|vue)",
		"./lib/**/*.@(css|ts|vue)",
	],
	presets: [preset],
	theme: {
		extend: {
			colors: {
				primary: {
					50: "#f4f7fb",
					100: "#e8eff6",
					200: "#cbdeec",
					300: "#9dc2dc",
					400: "#69a1c7",
					500: "#4686b1",
					600: "#346b95",
					700: "#2e5b80",
					800: "#274965",
					900: "#253e55",
					950: "#192938",
				},
				secondary: {
					50: "#fef9ec",
					100: "#fcecc9",
					200: "#f9d78e",
					300: "#f5bc54",
					400: "#f3a733",
					500: "#ec8314",
					600: "#d15f0e",
					700: "#ad4210",
					800: "#8d3313",
					900: "#742b13",
					950: "#421406",
				},
				neutral: colors.neutral,
				zinc: colors.zinc,

				function: colors.sky,
				person: colors.emerald,
				event: colors.rose,
				institution: colors.indigo,
				place: colors.purple,
				salary: colors.amber,
			},
			maxWidth: {
				container: "80rem",
				content: "64rem",
			},
			boxShadow: {
				header: "48px 0 0 0 white, -48px 0 0 0 white, 0 8px 40px -6px rgba(70, 70, 70, 0.4)",
				"header-dark": "48px 0 0 0 black, -48px 0 0 0 black, 0 8px 40px -6px rgba(0, 0, 0, 0.4)",
				"header-sm": "22px 0 0 0 white, -22px 0 0 0 white, 0 4px 18px -6px rgba(70, 70, 70, 0.4)",
				"header-dark-sm": "22px 0 0 0 black, -22px 0 0 0 black, 0 4px 18px -6px rgba(0, 0, 0, 0.4)",
			},
		},
	},
	plugins: [require("@headlessui/tailwindcss"), typography, require("tailwind-scrollbar")],
} satisfies Config;

export default config;
