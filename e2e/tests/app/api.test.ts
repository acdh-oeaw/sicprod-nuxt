import { expect, test } from "@/e2e/lib/test";
import { createApiClient } from "@/lib/create-api-client";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const baseUrl = process.env.NUXT_PUBLIC_API_BASE_URL!;
const ApiClient = createApiClient(baseUrl);

const apiListCalls = {
	// @ts-expect-error zod causes too complex types
	event: ApiClient.apis_api_ontology_event_list,
	// @ts-expect-error zod causes too complex types
	function: ApiClient.apis_api_ontology_function_list,
	// @ts-expect-error zod causes too complex types
	institution: ApiClient.apis_api_ontology_institution_list,
	// @ts-expect-error zod causes too complex types
	person: ApiClient.apis_api_ontology_person_list,
	// @ts-expect-error zod causes too complex types
	place: ApiClient.apis_api_ontology_place_list,
	// @ts-expect-error zod causes too complex types
	salary: ApiClient.apis_api_ontology_salary_list,
};

test.describe("api", () => {
	test("should check if ApiClient initialization was successful", () => {
		expect(ApiClient).toBeTruthy();
	});
	Object.entries(apiListCalls).forEach(([className, apiFunction]) => {
		test(`should retrieve list of ${className}s`, async () => {
			const listResult = await apiFunction();
			expect(listResult.results?.length).toBeGreaterThan(0);
		});
	});
});
