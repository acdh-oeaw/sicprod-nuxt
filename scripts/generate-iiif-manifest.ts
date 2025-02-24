import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { parseArgs } from "node:util";

import { createUrl, log, request } from "@acdh-oeaw/lib";
import { IIIFBuilder } from "@iiif/builder";
import { z } from "zod";

const outputFolder = join(process.cwd(), "assets", "manifests");

async function generate() {
	const args = parseArgs({ options: { force: { type: "boolean", short: "f" } } });

	const manifestFilePath = join(outputFolder, "collection-manifest.json");

	if (existsSync(manifestFilePath) && !args.values.force) {
		return false;
	}

	log.info("Generating iiif manifest...");

	const apiBaseUrl = z.string().url().parse(process.env.NUXT_PUBLIC_IIIF_BASE_URL);

	const booksUrl = createUrl({ baseUrl: apiBaseUrl, pathname: "/images/sicprod/" });
	const books = (await request(booksUrl, { responseType: "json" })) as Array<string>;

	const imageFileNamesByBook = new Map<string, Array<string>>();

	for (const bookId of books) {
		if (bookId === "list") continue;

		const url = createUrl({ baseUrl: apiBaseUrl, pathname: `/images/sicprod/${bookId}/` });
		const imageFileNames = (await request(url, { responseType: "json" })) as Array<string>;

		imageFileNamesByBook.set(bookId, imageFileNames);
	}

	//

	const width = 4914;
	const height = 3954;

	const builder = new IIIFBuilder();

	const collectionManifest = builder.createCollection("ScanCollection", (collection) => {
		for (const bookId of books) {
			const url = String(
				createUrl({ baseUrl: apiBaseUrl, pathname: `/iiif/images/sicprod/${bookId}/` }),
			);

			collection.createManifest(url, (manifest) => {
				manifest.addLabel(bookId.replaceAll("_", " "), "de");

				const imageFileNames = imageFileNamesByBook.get(bookId);

				imageFileNames?.forEach((fileName: string) => {
					const imageFileName = fileName.replace(".jpg", ".jp2");

					manifest.createCanvas(randomUUID(), (canvas) => {
						canvas.addLabel(fileName.replace(".jpg", ""), "de");

						canvas.width = width;
						canvas.height = height;

						const annotationId = String(
							createUrl({
								baseUrl: apiBaseUrl,
								pathname: `/iiif/images/sicprod/${bookId}/${imageFileName}/annotation`,
							}),
						);

						const thumbnailId = String(
							createUrl({
								baseUrl: apiBaseUrl,
								pathname: `/iiif/images/sicprod/${bookId}/${imageFileName}/full/100,/0/default.jpg`,
							}),
						);

						const bodyId = String(
							createUrl({
								baseUrl: apiBaseUrl,
								pathname: `/iiif/images/sicprod/${bookId}/${imageFileName}/full/full/0/default.jpg`,
							}),
						);

						canvas.createAnnotation(annotationId, {
							id: annotationId,
							type: "Annotation",
							motivation: "painting",
							thumbnail: [{ type: "Image", id: thumbnailId }],
							body: {
								id: bodyId,
								type: "Image",
								format: "image/jpeg",
								height,
								width,
							},
						});
					});
				});
			});
		}
	});

	//

	await mkdir(outputFolder, { recursive: true });

	for (const manifest of collectionManifest.items) {
		const name = decodeURI(manifest.id.split("/").at(-2)!);
		const filePath = join(outputFolder, `${name}.json`);
		const fileContent = builder.toPresentation3({ id: manifest.id, type: "Manifest" });

		await writeFile(filePath, JSON.stringify(fileContent), { encoding: "utf-8" });
	}

	const fileContent = builder.toPresentation3({ id: collectionManifest.id, type: "Collection" });

	await writeFile(manifestFilePath, JSON.stringify(fileContent), { encoding: "utf-8" });

	return true;
}

generate()
	.then((didGenerateManifest) => {
		if (didGenerateManifest) {
			log.success(
				"Successfully generated iiif manifest.\n",
				`Output was written to: "${outputFolder}".`,
			);
		} else {
			log.success(`Found cached iiif manifest in "${outputFolder}".`);
		}
	})
	.catch((error: unknown) => {
		log.error("Failed to generate iiif manifest.\n", String(error));
	});
