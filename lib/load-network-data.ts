import type { DeepReadonlyObject } from "@zodios/core/lib/utils.types";

import type { NetworkEntry, PaginatedNetworkList } from "@/types/resulttypes";

type ParamType = DeepReadonlyObject<Record<string, number | string | null | undefined>>;
interface endpointProps {
	queries: {
		limit?: number;
		offset?: number;
		entities?: Array<
			| "apis_ontology.event"
			| "apis_ontology.function"
			| "apis_ontology.institution"
			| "apis_ontology.person"
			| "apis_ontology.place"
			| "apis_ontology.salary"
		>;
	};
	params?: ParamType;
	[x: number | string]: unknown;
}
type EndpointType = (params: endpointProps) => Promise<PaginatedNetworkList>;

export async function loadNetworkData(endpoint: EndpointType, params: endpointProps) {
	let response: PaginatedNetworkList = await endpoint(params);
	let reducedResults: Array<NetworkEntry> = [];

	reducedResults = reducedResults.concat(response.results);

	while (response.next) {
		console.log("Loading next round: ", reducedResults.length);
		const nextParams = new URL(response.next).searchParams;
		response = await endpoint({
			...params,
			queries: {
				limit: Number(nextParams.get("limit")),
				offset: Number(nextParams.get("offset")),
				entities: params.queries.entities,
			},
		});

		reducedResults = reducedResults.concat(response.results);
	}

	return reducedResults;
}
