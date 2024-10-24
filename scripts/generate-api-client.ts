import { createUrl, createUrlSearchParams, log, request } from "@acdh-oeaw/lib";
import { generateZodClientFromOpenAPI } from "openapi-zod-client";
import type { OpenAPIObject, PathsObject } from "openapi3-ts/oas30";
import { z } from "zod";

const outputPath = "./lib/api.ts";
async function main() {
	log.info("Starting zod client generation");

	const apisBaseURL = z.string().url().parse(process.env.NUXT_PUBLIC_API_BASE_URL);

	const options = {
		url: createUrl({
			baseUrl: apisBaseURL,
			pathname: "/apis/swagger/schema",
			searchParams: createUrlSearchParams({ format: "json" }),
		}),
		prefixes: [
			"/apis/api/apis_ontology.event",
			"/apis/api/apis_ontology.function",
			"/apis/api/apis_ontology.institution",
			"/apis/api/apis_ontology.person",
			"/apis/api/apis_ontology.place",
			"/apis/api/apis_ontology.salary",
			"/apis/api/network",
		],
		dist: outputPath,
	};

	// download swagger file
	const data = await request(options.url, { responseType: "json" });

	// trim swagger file to only contain the prefixes specified in options.prefixes
	const prefixes = options.prefixes;
	let openApiDoc: OpenAPIObject = data as OpenAPIObject;
	const paths: PathsObject = {};
	for (const [key, value] of Object.entries(openApiDoc.paths)) {
		if (prefixes.some((retain) => key.startsWith(retain))) {
			paths[key] = value;
		}
	}
	openApiDoc = {
		...openApiDoc,
		paths,
	};

	// use the trimmed openAPIDoc with openapi-zod-client
	await generateZodClientFromOpenAPI({
		openApiDoc,
		distPath: options.dist,
		options: {
			shouldExportAllTypes: true,
			withAlias: true,
		},
	});
}

main()
	.then(() => {
		log.success("Client creation completed. \nOutput was written to: ", outputPath);
	})
	.catch((error: unknown) => {
		log.error("Client creation failed", String(error));
	});
