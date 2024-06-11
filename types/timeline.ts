import type { TempTriple } from "@/types/resulttypes";

export type TimelineObject = TempTriple & {
	class: "event" | "function" | "institution" | "person" | "place" | "salary";
};
