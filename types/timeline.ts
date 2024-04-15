export interface TimelineObject {
	start_date: string;
	start_date_written: string;
	end_date: string;
	end_date_written: string;
	class: "event" | "function" | "institution" | "person" | "place" | "salary";
	name: string;
	to: {
		name: string;
		id: number;
	};
}
