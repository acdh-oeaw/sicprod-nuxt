import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { createUrl, log, request } from "@acdh-oeaw/lib";
import { IIIFBuilder } from "@iiif/builder";
import { z } from "zod";

const outputFolder = join(process.cwd(), "assets", "manifests");

async function generate() {
	log.info("Generating iiif manifest...");

	const apiBaseUrl = z.string().url().parse(process.env.NUXT_PUBLIC_IIIF_BASE_URL);

	const booksUrl = createUrl({ baseUrl: apiBaseUrl, pathname: "/images/sicprod/" });
	const _books = (await request(booksUrl, { responseType: "json" })) as Array<string>;
	const books = _books.filter((book) => book !== "list");

	const imagesPerBook: Array<Array<string>> = (await Promise.all(
		books.map((book) => {
			const bookUrl = createUrl({ baseUrl: apiBaseUrl, pathname: `/images/sicprod/${book}/` });
			return request(bookUrl, { responseType: "json" });
		}),
	)) as Array<Array<string>>;

	//

	const width = 4914;
	const height = 3954;

	const builder = new IIIFBuilder();

	const collectionManifest = builder.createCollection("ScanCollection", (collection) => {
		books.forEach((book: string, index: number) => {
			const url = String(
				createUrl({ baseUrl: apiBaseUrl, pathname: `/iiif/images/sicprod/${book}/` }),
			);

			collection.createManifest(url, (manifest) => {
				manifest.addLabel(book.replaceAll("_", " "), "de");

				const bookData = imagesPerBook[index];

				bookData?.forEach((img: string) => {
					const imgName = img.replace(".jpg", ".jp2");

					manifest.createCanvas(randomUUID(), (canvas) => {
						canvas.addLabel(img.replace(".jpg", ""), "de");
						canvas.width = width;
						canvas.height = height;

						const annotationId = String(
							createUrl({
								baseUrl: apiBaseUrl,
								pathname: `/iiif/images/sicprod/${book}/${imgName}/annotation`,
							}),
						);

						const thumbnailId = String(
							createUrl({
								baseUrl: apiBaseUrl,
								pathname: `/iiif/images/sicprod/${book}/${imgName}/full/100,/0/default.jpg`,
							}),
						);

						const bodyId = String(
							createUrl({
								baseUrl: apiBaseUrl,
								pathname: `/iiif/images/sicprod/${book}/${imgName}/full/full/0/default.jpg`,
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
								format: "image/jpg",
								height,
								width,
							},
						});
					});
				});
			});
		});
	});

	//

	await mkdir(outputFolder, { recursive: true });

	for (const manifest of collectionManifest.items) {
		const name = decodeURI(manifest.id.split("/").slice(-1).join(""));
		const filePath = join(outputFolder, `${name}.json`);
		const fileContent = builder.toPresentation3({ id: manifest.id, type: "Manifest" });

		await writeFile(filePath, JSON.stringify(fileContent), { encoding: "utf-8" });
	}

	const filePath = join(outputFolder, "collection-manifest.json");
	const fileContent = builder.toPresentation3({ id: collectionManifest.id, type: "Collection" });

	await writeFile(filePath, JSON.stringify(fileContent), { encoding: "utf-8" });
}

generate()
	.then(() => {
		log.success(
			"Successfully generated iiif manifest.\n",
			`Output was written to: "${outputFolder}".`,
		);
	})
	.catch((error: unknown) => {
		log.error("Failed to generate iiif manifest.\n", String(error));
	});
