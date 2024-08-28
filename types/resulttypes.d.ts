import { z } from "zod";

import { schemas } from "@/lib/api";

const PaginatedListResult = z.union([
	schemas.PaginatedEventList,
	schemas.PaginatedFunctionList,
	schemas.PaginatedInstitutionList,
	schemas.PaginatedPersonList,
	schemas.PaginatedPlaceList,
	schemas.PaginatedSalaryList,
]);
export type PaginatedListResultType = z.infer<typeof PaginatedListResult>;
export type ModelString = "event" | "function" | "institution" | "person" | "place" | "salary";

export type TempTriple = z.infer<typeof schemas.TempTriple>;

export interface PaginatedTempTripleListType {
	count: number;
	next?: string | null | undefined;
	previous?: string | null | undefined;
	results: Array<TempTriple>;
}

export interface FacetType {
	id?: number | string;
	name: string;
	count: number;
}

export type Reference = z.infer<typeof schemas.Reference>;

export type NetworkEntry = z.infer<typeof schemas.Network>;

export type PaginatedNetworkList = z.infer<typeof schemas.PaginatedNetworkList>;
