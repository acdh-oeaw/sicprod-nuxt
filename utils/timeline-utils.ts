import type { TempTriple } from "@/types/resulttypes";
import type { TimelineObject } from "@/types/timeline";

//type guard to filter grouped relations
function isValidTimelineObject(
	entry: Array<TimelineObject> | TimelineObject | undefined,
): entry is TimelineObject | [TimelineObject, ...Array<TimelineObject>] {
	return entry !== undefined && Array.isArray(entry) ? entry.length > 0 : true;
}

export function groupTimelineRelations(filteredRelations: Array<TimelineObject>) {
	const groupedDict: Record<string, Array<TimelineObject>> = {};
	filteredRelations.forEach((r) => {
		if (!((r.start_date ?? "") in groupedDict)) groupedDict[r.start_date ?? ""] = [];
		groupedDict[r.start_date ?? ""]?.push(r);
	});
	return Object.entries(groupedDict)
		.sort(([keyA, _valA], [keyB, _valB]) => {
			return new Date(keyA).valueOf() - new Date(keyB).valueOf();
		})
		.map(([_key, arr]) => (arr.length > 1 ? arr : arr[0]))
		.filter((arr): arr is TimelineObject | [TimelineObject, ...Array<TimelineObject>] =>
			isValidTimelineObject(arr),
		);
}

export function getFlattenedRelations(relations: Record<string, Array<TempTriple>>) {
	const res = Object.entries(relations)
		.map(([key, val]) =>
			val.map((entry) => {
				return {
					...entry,
					class: key,
				};
			}),
		)
		.flat()
		.filter((r): r is TimelineObject => Boolean(r.start_date) || Boolean(r.end_date))
		.map((entry) => {
			let start_date_written = entry.start_date_written;
			if (!start_date_written || start_date_written === "")
				start_date_written = entry.end_date_written;
			return {
				...entry,
				start_date: entry.start_date ?? entry.end_date,
				start_date_written: start_date_written,
			};
		});
	return res;
}
