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
