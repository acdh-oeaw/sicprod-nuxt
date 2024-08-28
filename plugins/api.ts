import { createApiClient } from "../lib/api";

export default defineNuxtPlugin({
	name: "api",
	setup() {
		const config = useRuntimeConfig();
		const apiSpecUrl = config.public.NUXT_PUBLIC_API_BASE_URL;
		const client = createApiClient(apiSpecUrl, {
			axiosConfig: { paramsSerializer: { indexes: null } },
		});
		return {
			provide: {
				api: client,
			},
		};
	},
});
