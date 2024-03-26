import { createApiClient } from "../lib/create-api-client";

export default defineNuxtPlugin({
	name: "api",
	setup() {
		const config = useRuntimeConfig();
		const apiSpecUrl = config.public.NUXT_PUBLIC_APP_BASE_URL;
		const client = createApiClient(apiSpecUrl);
		return {
			provide: {
				api: client,
			},
		};
	},
});
