import type { TempTriple } from "#/app/types/resulttypes.d.ts";

export type TimelineClass = "event" | "function" | "institution" | "person" | "place" | "salary";

export type TimelineObject = TempTriple & {
	class: TimelineClass;
};
