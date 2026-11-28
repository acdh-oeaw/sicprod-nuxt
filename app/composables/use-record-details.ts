import { HttpError } from "@acdh-oeaw/lib";
import { useQuery } from "@tanstack/vue-query";

interface RecordDates {
	start_date_written?: string | null;
	end_date_written?: string | null;
}

export function useRecordDetails<Record extends RecordDates>(
	endpoint: string,
	id: number,
	fetchRecord: () => Promise<Record>,
	getName: (record: Record) => string | null | undefined,
	category: string,
) {
	if (!Number.isSafeInteger(id) || id <= 0) {
		throw createError({ statusCode: 404, fatal: true });
	}

	const entity = useQuery({
		queryKey: [endpoint, id],
		queryFn: fetchRecord,
		retry: false,
	});

	const t = useTranslations();
	usePageMetadata({
		title: computed(() => {
			const record = entity.data.value;
			return (record && getName(record)?.trim()) || category;
		}),
		description: computed(() => {
			const record = entity.data.value;
			const name = record && getName(record)?.trim();
			if (!name) {
				return t("DefaultLayout.meta.description");
			}

			const dates = [record.start_date_written, record.end_date_written]
				.filter(Boolean)
				.join(" – ");
			return t("DetailPage.meta.description", {
				record: dates ? `${name} (${dates})` : name,
			});
		}),
	});

	async function load() {
		const { error } = await entity.suspense();
		if (error) {
			const statusCode = error instanceof HttpError && error.response.status === 404 ? 404 : 502;
			throw createError({ statusCode, fatal: true, cause: error });
		}
	}

	return { entity, load };
}
