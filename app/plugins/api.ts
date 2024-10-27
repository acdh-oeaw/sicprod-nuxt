import { createApiClient } from "../lib/api";

export default defineNuxtPlugin({
	name: "api",
	setup() {
		const env = useRuntimeConfig();

		const client = createApiClient(env.public.apiBaseUrl, {
			axiosConfig: { paramsSerializer: { indexes: null } },
		});

		return {
			provide: {
				api: client,
			},
		};
	},
});
