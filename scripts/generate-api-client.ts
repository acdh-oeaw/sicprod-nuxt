import { join } from "node:path";

import { createUrl, createUrlSearchParams, log, request } from "@acdh-oeaw/lib";
import { generateZodClientFromOpenAPI } from "openapi-zod-client";
import type { OpenAPIObject, PathsObject } from "openapi3-ts/oas30";
import { z } from "zod";

const outputFilePath = join(process.cwd(), "app", "lib", "api.ts");

async function generate() {
	log.info("Generating api client...");

	const apiBaseUrl = z.string().url().parse(process.env.NUXT_PUBLIC_API_BASE_URL);

	const url = createUrl({
		baseUrl: apiBaseUrl,
		pathname: "/apis/swagger/schema",
		searchParams: createUrlSearchParams({ format: "json" }),
	});

	/** Fetch openapi spec document. */
	const openApiDoc = (await request(url, { responseType: "json" })) as OpenAPIObject;

	/** Remove unused endpoints. */
	const prefixes = [
		"/apis/api/apis_ontology.event",
		"/apis/api/apis_ontology.function",
		"/apis/api/apis_ontology.institution",
		"/apis/api/apis_ontology.person",
		"/apis/api/apis_ontology.place",
		"/apis/api/apis_ontology.salary",
		"/apis/api/network",
	];

	const paths: PathsObject = {};

	for (const [key, value] of Object.entries(openApiDoc.paths)) {
		if (
			prefixes.some((retain) => {
				return key.startsWith(retain);
			})
		) {
			paths[key] = value;
		}
	}

	/** Generate api client. */
	await generateZodClientFromOpenAPI({
		distPath: outputFilePath,
		openApiDoc: {
			...openApiDoc,
			paths,
		},
		options: {
			shouldExportAllTypes: true,
			withAlias: true,
		},
	});
}

generate()
	.then(() => {
		log.success(
			"Successfully generated api client.\n",
			`Output was written to: "${outputFilePath}".`,
		);
	})
	.catch((error: unknown) => {
		log.error("Failed to generate api client.\n", String(error));
	});
