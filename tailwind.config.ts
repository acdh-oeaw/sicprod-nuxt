import { createPreset } from "@acdh-oeaw/tailwindcss-preset";
import type { Config } from "tailwindcss";

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
			},
		},
	},
} satisfies Config;

export default config;
