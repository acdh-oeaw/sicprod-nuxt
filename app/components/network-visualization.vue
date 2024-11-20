<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue";
import { useQuery } from "@tanstack/vue-query";
import { CheckIcon, ChevronUpIcon, MoveHorizontalIcon, Share2Icon } from "lucide-vue-next";

import { bgColors } from "@/lib/colors";
import { getGraph } from "@/lib/get-graph";
import { loadNetworkData } from "@/lib/load-network-data";

const t = useTranslations();

const api = useApiClient();
const limit = 5000;

const availableClasses = ["event", "function", "institution", "person", "place", "salary"] as const;
const selectedClasses = ref<Array<(typeof availableClasses)[number]>>(["person", "function"]);

const { data, isLoading } = useQuery({
	queryKey: ["apis_api_network_list", selectedClasses, limit] as const,
	queryFn({ queryKey }) {
		const [endpoint, selectedClasses, limit] = queryKey;

		return loadNetworkData(api[endpoint], {
			queries: {
				limit,
				// @ts-expect-error apis_ontology mapping
				entities: selectedClasses.map((className) => {
					return `apis_ontology.${className}`;
				}),
			},
		});
	},
});

const nodeDistance = ref(10);

const minDegree = ref(1);
const maxDegree = computed(() => {
	if (data.value == null) return 1;

	return Math.min(
		Math.max(
			...data.value.map((node) => {
				return node.related_to.length;
			}),
		),
		10,
	);
});

const graph = computed(() => {
	return getGraph(data.value ?? [], minDegree.value);
});
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
										<CheckIcon aria-hidden="true" class="size-5" />
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
							<ChevronUpIcon aria-hidden="true" class="size-5 text-neutral-400" />
						</span>
					</ListboxButton>
				</div>
			</Listbox>

			<div class="float-right mt-2 flex gap-2 px-2 pb-1 text-neutral-600">
				<label class="flex gap-2" :title="t('NetworkVisualization.hide-nodes')">
					<span class="sr-only">{{ t("NetworkVisualization.hide-nodes") }}</span>
					<Share2Icon class="inline size-5" />
					<input v-model="minDegree" class="inline" :max="maxDegree" min="0" type="range" />
				</label>
			</div>

			<div class="mt-2 flex gap-2 px-2 pb-1 text-neutral-600">
				<label class="flex gap-2" :title="t('NetworkVisualization.node-distance')">
					<span class="sr-only">{{ t("NetworkVisualization.node-distance") }}</span>
					<MoveHorizontalIcon class="inline size-5" />
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
						{{ t("NetworkVisualization.nodes") }}
					</span>
					{{ graph.nodes.length }}
				</div>
				<div>
					<span class="block font-bold uppercase text-neutral-300 dark:text-neutral-600">
						{{ t("NetworkVisualization.links") }}
					</span>
					{{ graph.links.length }}
				</div>
			</div>
		</div>

		<GraphViz :graph="graph" :node-distance="+nodeDistance" />
	</div>
</template>
