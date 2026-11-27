<script setup lang="ts">
import * as d3 from "d3-force";
import ForceGraph from "force-graph";

import type { GraphData, GraphLink, GraphNode } from "@/types/graph";

const props = defineProps<{
	graph: GraphData;
	nodeDistance: number;
}>();
/** Used for nodes without a color, e.g. of an unknown entity type. */
const fallbackNodeColor = "#a3a3a3";

const forcegraph = shallowRef<ForceGraph<GraphNode, GraphLink>>();
const networkContainer = ref<HTMLElement>();
const localePath = useLocalePath();
const router = useRouter();

const highlightedLinks = ref<Set<GraphLink>>(new Set());
const highlightedNodes = ref<Set<GraphNode>>(new Set());

function initSigma() {
	if (!import.meta.client) {
		return;
	}

	if (!networkContainer.value) {
		return;
	}

	const height = networkContainer.value.clientHeight - 1;
	const width = networkContainer.value.clientWidth - 1;
	const myGraph = new ForceGraph<GraphNode, GraphLink>(networkContainer.value);
	forcegraph.value = myGraph
		.graphData(props.graph)
		.linkColor((link) => {
			return highlightedLinks.value.has(link) ? "#aaaaaa" : "#cccccc30";
		})
		.nodeColor((node) => {
			const color = node.color ?? fallbackNodeColor;
			return highlightedNodes.value.size === 0
				? `${color}d0`
				: highlightedNodes.value.has(node)
					? color
					: `${color}55`;
		})
		.warmupTicks(100)
		.cooldownTicks(0)
		.autoPauseRedraw(false)
		.height(height)
		.width(width)
		.onNodeClick((node) => {
			const path = localePath(`/detail/${node.class}/${node.id}`);
			void router.push(path);
		})
		.onNodeHover((node) => {
			highlightedNodes.value.clear();
			highlightedLinks.value.clear();
			if (node) {
				myGraph
					.graphData()
					.links.filter((link) => {
						return link.source === node || link.target === node;
					})
					.forEach((link) => {
						return highlightedLinks.value.add(link);
					});
				highlightedLinks.value.forEach((link) => {
					highlightedNodes.value.add(link.target as GraphNode);
					highlightedNodes.value.add(link.source as GraphNode);
				});
			}
		});
	forcegraph.value.d3Force(
		"collide",
		d3.forceCollide<GraphNode>((node) => {
			return Math.sqrt(node.val) * myGraph.nodeRelSize() * 1.1;
		}),
	);
	forcegraph.value.d3Force(
		"charge",
		d3.forceManyBody<GraphNode>().strength((node) => {
			return -node.val * props.nodeDistance;
		}),
	);
	forcegraph.value.onEngineStop(() => {
		forcegraph.value?.zoomToFit(400);
		forcegraph.value?.cooldownTicks(100);
		// oxlint-disable-next-line eslint/no-empty-function
		forcegraph.value?.onEngineStop(() => {});
	});
}
onMounted(() => {
	void nextTick(initSigma);
});
watch(
	() => {
		return props.graph;
	},
	() => {
		forcegraph.value?.graphData(props.graph);

		forcegraph.value?.d3ReheatSimulation();
	},
);
watch(
	() => {
		return props.nodeDistance;
	},
	() => {
		forcegraph.value?.d3Force(
			"charge",
			d3.forceManyBody<GraphNode>().strength((node) => {
				return -node.val * props.nodeDistance;
			}),
		);
		forcegraph.value?.d3ReheatSimulation();
	},
);
</script>

<template>
	<div id="networkContainer" ref="networkContainer" class="size-full overflow-hidden" />
</template>
