import { expect, test } from "@/e2e/lib/test";
import { createApiClient } from "@/lib/api";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const baseUrl = process.env.NUXT_PUBLIC_API_BASE_URL!;
const ApiClient = createApiClient(baseUrl);

const apiListCalls = {
	event: ApiClient["apis_api_apis_ontology.event_list"],
	function: ApiClient["apis_api_apis_ontology.function_list"],
	institution: ApiClient["apis_api_apis_ontology.institution_list"],
	person: ApiClient["apis_api_apis_ontology.person_list"],
	place: ApiClient["apis_api_apis_ontology.place_list"],
	salary: ApiClient["apis_api_apis_ontology.salary_list"],
};

test.describe("api", () => {
	test("should check if ApiClient initialization was successful", () => {
		expect(ApiClient).toBeTruthy();
	});
	Object.entries(apiListCalls).forEach(([className, apiFunction]) => {
		test(`should retrieve list of ${className}s`, async () => {
			const listResult = await apiFunction();
			expect(listResult.results.length).toBeGreaterThan(0);
		});
	});
});
