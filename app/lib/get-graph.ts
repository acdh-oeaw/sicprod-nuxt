import type { LinkObject } from "force-graph";

import { colorCodes } from "@/lib/colors";
import type { NetworkEntry } from "@/types/resulttypes";

export function getGraph(data: Array<NetworkEntry>, minDegree = 0) {
	interface Graph {
		nodes: Array<{
			id: string;
			name: string;
			val: number;
			color?: string;
			class?: string;
		}>;
		links: Array<LinkObject>;
	}

	const graph: Graph = {
		nodes: [],
		links: [],
	};

	const edgeDict: Record<string, Array<string>> = {};
	data.forEach((entity) => {
		if (entity.related_to.length >= minDegree) {
			graph.nodes.push({
				id: String(entity.id),
				name: entity.name,
				val: entity.related_to.length,
				color: colorCodes[entity.type],
				class: entity.type,
			});
		}

		edgeDict[entity.id] = [];
	});

	data.flatMap((entity) => {
		if (entity.related_to.length >= minDegree) {
			entity.related_to.forEach((target) => {
				edgeDict[target]?.push(`${String(entity.id)}-${String(target)}`);
				// edgeDict[entity.id]?.push(`${String(entity.id)}-${String(target)}`);
			});
		}
	});

	const filteredEdgeDict = Object.fromEntries(
		Object.entries(edgeDict).filter(([_key, val]) => {
			return val.length >= minDegree;
		}),
	);

	const flattenedEdges = [
		...new Set(
			Object.entries(filteredEdgeDict).flatMap(([_key, val]) => {
				return val;
			}),
		),
	];

	flattenedEdges.forEach((edge) => {
		const node1 = edge.split("-")[0] ?? "";
		const node2 = edge.split("-")[1] ?? "";
		if (Number(node1) < Number(node2) && node1 in filteredEdgeDict && node2 in filteredEdgeDict) {
			graph.links.push({ source: node1, target: node2 });
		}
	});

	graph.nodes = graph.nodes.filter((node) => {
		return node.id in filteredEdgeDict;
	});

	return graph;
}
