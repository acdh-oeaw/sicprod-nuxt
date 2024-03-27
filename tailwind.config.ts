import { createPreset } from "@acdh-oeaw/tailwindcss-preset";
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
			},
		},
	},
	plugins: [require("@headlessui/tailwindcss")],
} satisfies Config;

export default config;
