import type { TempTriple } from "@/types/resulttypes";

export type TimelineClass = "event" | "function" | "institution" | "person" | "place" | "salary";

export type TimelineObject = TempTriple & {
	class: TimelineClass;
};
