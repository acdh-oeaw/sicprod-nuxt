<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import Graph from "graphology";

import { colorCodes } from "@/lib/colors";
import { loadNetworkData } from "@/lib/load-network-data";
import type { NetworkEntry } from "@/types/resulttypes";

const { $api } = useNuxtApp();
const networkEndpoint = "apis_api_network_list";

const entityFilter: Array<
	| "apis_ontology.event"
	| "apis_ontology.function"
	| "apis_ontology.institution"
	| "apis_ontology.person"
	| "apis_ontology.place"
	| "apis_ontology.salary"
> = ["apis_ontology.person", "apis_ontology.function"];
const { data, isLoading } = useQuery({
	queryKey: [networkEndpoint, entityFilter.join(",")],
	queryFn: () =>
		loadNetworkData($api[networkEndpoint], { queries: { limit: 5000, entities: entityFilter } }),
});
// watch(
// 	() => data.value?.pageParams,
// 	() => {
// 		if (hasNextPage.value && !isFetchingNextPage.value) void fetchNextPage();
// 	},
// );
function getGraph(data: Array<NetworkEntry>) {
	console.log("Start getGraph: ", new Date());
	let graph = new Graph();
	data.forEach((entity) => {
		graph.addNode(String(entity.id), {
			label: entity.name,
			x: Math.random(),
			y: Math.random(),
			size: Math.log(entity.related_to.length),
			color: colorCodes[entity.type],
		});
	});
	console.log("add Edges: ", new Date(), data);
	const edgeDict: Record<string, Array<string>> = {};
	data.flatMap((entity) => {
		entity.related_to.forEach((target) => {
			if (!(String(target) in edgeDict)) edgeDict[String(target)] = [];
			edgeDict[String(target)]?.push(`${entity.id}-${String(target)}`);
		});
	});
	const flattenedEdges = [
		...new Set(
			Object.entries(edgeDict)
				.filter(([key, _val]) => graph.hasNode(String(key)))
				.flatMap(([_key, val]) => val),
		),
	];
	console.log("Found ", flattenedEdges.length, " edges");

	flattenedEdges.forEach((edge) => {
		graph.addEdge(edge.split("-")[0], edge.split("-")[1]);
	});
	// });
	console.log("End getGraph: ", new Date());
	return graph;
}
const graph = computed(() => getGraph(data.value ?? []));
</script>

<template>
	<!-- <Graph v-if="!isLoading" :data="data ?? []" /> -->

	<Loader v-if="isLoading" />
	<div v-else>
		{{ data?.length }}

		<GraphViz :graph="graph" />
	</div>
</template>
