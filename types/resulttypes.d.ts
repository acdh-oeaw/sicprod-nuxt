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
