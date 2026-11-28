import { createUrl } from "@acdh-oeaw/lib";
import { defineCachedHandler } from "nitro/cache";
import { useRuntimeConfig } from "nitro/runtime-config";
import * as v from "valibot";

import { createApiClient } from "#/app/lib/api.ts";
import { escape } from "#/app/utils/safe-json-ld-replacer.ts";

const recordTypes = ["event", "function", "institution", "person", "place", "salary"] as const;

const pages = [
	"/",
	"/iiif",
	"/imprint",
	"/network",
	"/search/events",
	"/search/functions",
	"/search/institutions",
	"/search/persons",
	"/search/places",
	"/search/salaries",
];

async function getRecordPaths(apiBaseUrl: string) {
	const api = createApiClient(apiBaseUrl);
	const recordPaths = await Promise.all(
		recordTypes.map(async (type) => {
			const list = api[`apis_api_apis_ontology.${type}_list`];
			const paths: Array<string> = [];
			let offset = 0;

			while (true) {
				const page = await list({ queries: { limit: 500, offset } });

				for (const { id } of page.results) {
					paths.push(`/detail/${type}/${id}`);
				}

				if (!page.next) {
					return paths;
				}

				if (page.results.length === 0) {
					throw new Error(`The ${type} API returned an empty sitemap page with a next link.`);
				}

				offset += page.results.length;
			}
		}),
	);

	return recordPaths.flat();
}

export default defineCachedHandler(
	async (event) => {
		const config = useRuntimeConfig().public as Record<string, unknown>;
		const baseUrl = v.parse(v.pipe(v.string(), v.url()), config.appBaseUrl);

		const paths = new Set(pages);
		if (config.bots === "enabled") {
			const apiBaseUrl = v.parse(v.pipe(v.string(), v.url()), config.apiBaseUrl);
			for (const path of await getRecordPaths(apiBaseUrl)) {
				paths.add(path);
			}
		}

		event.res.headers.set("content-type", "application/xml; charset=utf-8");
		return [
			'<?xml version="1.0" encoding="UTF-8"?>',
			'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
			...Array.from(paths, (pathname) => {
				const url = String(createUrl({ baseUrl, pathname }));
				return `<url><loc>${escape(url)}</loc></url>`;
			}),
			"</urlset>",
		].join("\n");
	},
	{ maxAge: 60 * 60, swr: true },
);
