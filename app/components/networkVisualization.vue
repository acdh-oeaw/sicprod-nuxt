<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue";
import { useQuery } from "@tanstack/vue-query";
import type { LinkObject } from "force-graph";
import { Check, ChevronUp, MoveHorizontal, Share2 } from "lucide-vue-next";

import { bgColors, colorCodes } from "@/lib/colors";
import { loadNetworkData } from "@/lib/load-network-data";
import type { NetworkEntry } from "@/types/resulttypes";

const t = useTranslations();

const { $api } = useNuxtApp();
const networkEndpoint = "apis_api_network_list";

const availableClasses = ["event", "function", "institution", "person", "place", "salary"] as const;

const selectedClasses = ref<Array<(typeof availableClasses)[number]>>(["person", "function"]);
const { data, isLoading } = useQuery({
	queryKey: [networkEndpoint, selectedClasses],
	queryFn: () =>
		loadNetworkData($api[networkEndpoint], {
			queries: {
				limit: 5000,
				//@ts-expect-error apis_ontology mapping
				entities: selectedClasses.value.map((className) => `apis_ontology.${className}`),
			},
		}),
});

function getGraph(data: Array<NetworkEntry>, minDegree = 0) {
	const graph = {
		nodes: [] as Array<{
			id: string;
			name: string;
			val: number;
			color?: string;
			class?: string;
		}>,
		links: [] as Array<LinkObject>,
	};
	const edgeDict: Record<string, Array<string>> = {};
	data.forEach((entity) => {
		if (entity.related_to.length >= minDegree)
			graph.nodes.push({
				id: String(entity.id),
				name: entity.name,
				val: entity.related_to.length,
				color: colorCodes[entity.type],
				class: entity.type,
			});
		edgeDict[entity.id] = [];
	});

	data.flatMap((entity) => {
		if (entity.related_to.length >= minDegree)
			entity.related_to.forEach((target) => {
				edgeDict[target]?.push(`${entity.id}-${target}`);
				// edgeDict[entity.id]?.push(`${entity.id}-${target}`);
			});
	});
	const filteredEdgeDict = Object.fromEntries(
		Object.entries(edgeDict).filter(([_key, val]) => val.length >= minDegree),
	);
	const flattenedEdges = [
		...new Set(Object.entries(filteredEdgeDict).flatMap(([_key, val]) => val)),
	];

	flattenedEdges.forEach((edge) => {
		const node1 = edge.split("-")[0] ?? "";
		const node2 = edge.split("-")[1] ?? "";
		if (Number(node1) < Number(node2) && node1 in filteredEdgeDict && node2 in filteredEdgeDict)
			graph.links.push({ source: node1, target: node2 });
	});
	graph.nodes = graph.nodes.filter((node) => node.id in filteredEdgeDict);
	return graph;
}
const minDegree = ref(1);
const maxDegree = computed(() =>
	Math.min(Math.max(...(data.value?.map((node) => node.related_to.length) ?? [1])), 10),
);
const graph = computed(() => getGraph(data.value ?? [], minDegree.value));

const nodeDistance = ref(10);
</script>

<template>
	<Centered v-if="isLoading"><Loader /></Centered>
	<div v-else class="relative size-full">
		<div
			class="absolute bottom-0 right-2 z-10 mb-2 mt-1 rounded-lg bg-white/70 p-2 dark:bg-neutral-900/70"
		>
			<Listbox v-model="selectedClasses" multiple>
				<div class="relative">
					<Transition
						leave-active-class="transition duration-100 ease-in"
						leave-from-class="opacity-100"
						leave-to-class="opacity-0"
					>
						<ListboxOptions
							class="bottom-11 right-0 z-10 mt-1 max-h-60 w-full overflow-auto py-1 sm:text-sm"
						>
							<ListboxOption
								v-for="className in availableClasses"
								:key="className"
								v-slot="{ active, selected }"
								as="template"
								:value="className"
							>
								<li
									:class="[
										active
											? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
											: 'text-neutral-900 dark:text-neutral-100',
										'relative cursor-pointer select-none py-2 pl-10 pr-4',
									]"
								>
									<span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
										{{ t(`Pages.searchviews.${className}.label`) }}
									</span>
									<span
										v-if="selected"
										class="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600"
									>
										<Check aria-hidden="true" class="size-5" />
									</span>
								</li>
							</ListboxOption>
						</ListboxOptions>
					</Transition>
					<ListboxButton
						class="relative w-full cursor-pointer py-2 pl-1 pr-10 text-left sm:text-sm"
					>
						<span
							v-for="className in selectedClasses"
							:key="className"
							class="mx-1 truncate rounded-md px-2 py-1"
							:class="[bgColors[className]]"
						>
							{{ t(`Pages.searchviews.${className.replace("apis_ontology.", "")}.label`) }}
						</span>
						<span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
							<ChevronUp aria-hidden="true" class="size-5 text-neutral-400" />
						</span>
					</ListboxButton>
				</div>
			</Listbox>
			<div class="float-right mt-2 flex gap-2 px-2 pb-1 text-neutral-600">
				<label class="flex gap-2" :title="t('Pages.network.hide-nodes')">
					<span class="sr-only">{{ t("Pages.network.hide-nodes") }}</span>
					<Share2 class="inline size-5"></Share2>
					<input v-model="minDegree" class="inline" :max="maxDegree" min="0" type="range" />
				</label>
			</div>
			<div class="mt-2 flex gap-2 px-2 pb-1 text-neutral-600">
				<label class="flex gap-2" :title="t('Pages.network.node-distance')">
					<span class="sr-only">{{ t("Pages.network.node-distance") }}</span>
					<MoveHorizontal class="inline size-5"></MoveHorizontal>
					<input
						v-model="nodeDistance"
						class="inline"
						:max="graph.nodes.length / 20"
						:min="1"
						type="range"
					/>
				</label>
			</div>
			<div
				class="float-right mt-2 flex gap-5 px-2 pb-1 text-center text-sm text-neutral-600 dark:text-neutral-300"
			>
				<div>
					<span class="block font-bold uppercase text-neutral-300 dark:text-neutral-600">
						{{ t("Pages.network.nodes") }}
					</span>
					{{ graph.nodes.length }}
				</div>
				<div>
					<span class="block font-bold uppercase text-neutral-300 dark:text-neutral-600">
						{{ t("Pages.network.links") }}
					</span>
					{{ graph.links.length }}
				</div>
			</div>
		</div>
		<GraphViz :graph="graph" :node-distance="+nodeDistance" />
	</div>
</template>
