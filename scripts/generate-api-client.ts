import { load } from "js-yaml";
import { generateZodClientFromOpenAPI } from "openapi-zod-client";
import type { OpenAPIObject, PathsObject } from "openapi3-ts/oas30";

console.log("Starting zod client generation");
const options = {
	url: "https://sicprod.acdh-dev.oeaw.ac.at/apis/swagger/schema/?format=json",
	prefixes: [
		"/apis/api/apis_ontology.event",
		"/apis/api/apis_ontology.function",
		"/apis/api/apis_ontology.institution",
		"/apis/api/apis_ontology.person",
		"/apis/api/apis_ontology.place",
		"/apis/api/apis_ontology.salary",
	],
	dist: "./lib/api.ts",
};

let data: string;
if (options.url) {
	// download swagger file
	const response = await fetch(options.url);
	if (!response.ok) {
		throw new Error(
			`Received a non-200 response when downloading from ${options.url}. Received ${response.statusText}. Please double check your setup.`,
		);
	}
	data = await response.text();
} else {
	throw new Error(`Found neither an input URL or an input file!`);
}

// trim swagger file to only contain the prefixes specified in options.prefixes
const prefixes = options.prefixes;
let openApiDoc: OpenAPIObject = load(data) as OpenAPIObject;
const paths: PathsObject = {};
for (const path of Object.keys(openApiDoc.paths)) {
	if (prefixes.some((retain) => path.startsWith(retain))) {
		paths[path] = openApiDoc.paths[path] ?? {};
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

console.log("Client creation completed");
console.log("Output was written to: ", options.dist);
