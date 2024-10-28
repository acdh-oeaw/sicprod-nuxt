import type { DeepReadonlyObject } from "@zodios/core/lib/utils.types";

import type { PaginatedTempTripleListType, TempTriple } from "@/types/resulttypes";

type ParamType = DeepReadonlyObject<Record<string, number | string | null | undefined>>;
interface endpointProps {
	params: {
		id: string;
	};
	query?: ParamType | undefined;
	[x: number | string]: unknown;
}
type EndpointType = (params: endpointProps) => Promise<PaginatedTempTripleListType>;

export async function loadAndGroupRelations(endpoint: EndpointType, params: endpointProps) {
	// type Classname = "event" | "function" | "institution" | "person" | "place" | "salary";
	const groupedResults: Record<string, Array<TempTriple>> = {
		function: [],
		event: [],
		person: [],
		institution: [],
		salary: [],
		place: [],
	};
	let response: PaginatedTempTripleListType = await endpoint(params);

	response.results.forEach((res) => {
		groupedResults[String(res.to.type)]?.push(res);
	});

	while (response.next) {
		const nextParams = new URL(response.next).searchParams;
		response = await endpoint({
			...params,
			queries: { limit: Number(nextParams.get("limit")), offset: Number(nextParams.get("offset")) },
		});

		response.results.forEach((res) => {
			groupedResults[String(res.to.type)]?.push(res);
		});
	}

	Object.keys(groupedResults).forEach((key) => {
		return groupedResults[key]?.sort((a, b) => {
			return new Date(a.start_date ?? 0).getTime() - new Date(b.start_date ?? 0).getTime();
		});
	});

	return groupedResults;
}
