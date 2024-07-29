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
