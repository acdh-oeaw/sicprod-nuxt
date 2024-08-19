import { createUrl, log, request } from "@acdh-oeaw/lib";
import { IIIFBuilder } from "@iiif/builder";
import { randomUUID } from "crypto";
import type { ErrnoException } from "fast-glob/out/types";
import * as fs from "fs";
import { z } from "zod";

const iiifBaseURL = z.string().url().parse(process.env.NUXT_PUBLIC_IIIF_BASE_URL);
const outputPath = "./assets/manifests";
fs.mkdirSync(outputPath);

async function main() {
	const builder = new IIIFBuilder();
	const books = (await request(iiifBaseURL.replace("/iiif/", "/"), {
		responseType: "json",
	})) as Array<string>;
	const imagesPerBook: Array<Array<string>> = (await Promise.all(
		books.map((book) =>
			request(
				createUrl({
					baseUrl: iiifBaseURL.replace("/iiif/", "/"),
					pathname: book,
				}).toString(),
				{ responseType: "json" },
			),
		),
	)) as Array<Array<string>>;

	const collectionManifest = builder.createCollection("ScanCollection", (collection) => {
		books.forEach((book: string, idx: number) => {
			collection.createManifest(
				createUrl({ baseUrl: iiifBaseURL, pathname: book }).toString(),
				(manifest) => {
					manifest.addLabel(book.replaceAll("_", " "), "de");
					const bookData = imagesPerBook[idx];

					if (Array.isArray(bookData)) {
						bookData.forEach((img: string) => {
							const imgName = img.replace(".jpg", ".jp2");
							manifest.createCanvas(randomUUID(), (canvas) => {
								canvas.addLabel(img.replace(".jpg", ""));
								canvas.width = 4914;
								canvas.height = 3954;
								const annotationID = createUrl({
									baseUrl: iiifBaseURL,
									pathname: `${book}/${imgName}/annotation`,
								}).toString();

								canvas.createAnnotation(annotationID, {
									id: annotationID,
									type: "Annotation",
									motivation: "painting",
									thumbnail: [
										{
											type: "Image",
											id: createUrl({
												baseUrl: iiifBaseURL,
												pathname: `${book}/${imgName}/full/100,/0/default.jpg`,
											}).toString(),
										},
									],
									body: {
										id: createUrl({
											baseUrl: iiifBaseURL,
											pathname: `${book}/${imgName}/full/full/0/default.jpg`,
										}).toString(),
										type: "Image",
										format: "image/jpg",
										height: 3954,
										width: 4914,
									},
								});
							});
						});
					}
				},
			);
		});
	});
	collectionManifest.items.forEach((manifest) => {
		fs.writeFile(
			`${outputPath}/${decodeURI(manifest.id.split("/").slice(-1).join(""))}.json`,
			JSON.stringify(
				builder.toPresentation3({
					id: manifest.id,
					type: "Manifest",
				}),
			),
			(msg: ErrnoException | null) => {
				if (msg) throw msg;
			},
		);
	});
	fs.writeFile(
		`${outputPath}/collection-manifest.json`,
		JSON.stringify(builder.toPresentation3({ id: collectionManifest.id, type: "Collection" })),
		(msg: ErrnoException | null) => {
			if (msg) throw msg;
		},
	);
}

main()
	.then(() => {
		log.success("Manifest creation completed. \nOutput was written to: ", outputPath);
	})
	.catch((err) => {
		log.error("Manifest creation failed", String(err));
	});
