import type {
	ApisApiApisOntologyEventListResponse,
	ApisApiApisOntologyFunctionListResponse,
	ApisApiApisOntologyInstitutionListResponse,
	ApisApiApisOntologyPersonListResponse,
	ApisApiApisOntologyPlaceListResponse,
	ApisApiApisOntologySalaryListResponse,
	Relation,
} from "#/app/lib/api-generated/types.gen.ts";

export type {
	Network as NetworkEntry,
	PaginatedNetworkList,
	PaginatedRelationList as PaginatedTempTripleListType,
	SimplifiedReference as Reference,
} from "#/app/lib/api-generated/types.gen.ts";

type PaginatedListResponse =
	| ApisApiApisOntologyEventListResponse
	| ApisApiApisOntologyFunctionListResponse
	| ApisApiApisOntologyInstitutionListResponse
	| ApisApiApisOntologyPersonListResponse
	| ApisApiApisOntologyPlaceListResponse
	| ApisApiApisOntologySalaryListResponse;

/** The API adds these pagination and facet fields outside its OpenAPI schema. */
export type PaginatedListResultType = PaginatedListResponse & {
	facets?: Record<string, unknown>;
	limit?: number;
};

export type ModelString = "event" | "function" | "institution" | "person" | "place" | "salary";

export type TempTriple = Relation;

export interface FacetType {
	id?: number | string;
	name: string;
	count: number;
}
