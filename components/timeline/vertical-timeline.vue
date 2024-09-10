<script setup lang="ts">
import {
	Dialog,
	DialogPanel,
	Listbox,
	ListboxButton,
	ListboxOption,
	ListboxOptions,
	TransitionChild,
	TransitionRoot,
} from "@headlessui/vue";
import { Check, ChevronDown, X } from "lucide-vue-next";

import { bgColorsSemiTransparent } from "@/lib/colors";
import type { TimelineObject } from "@/types/timeline";
import { groupTimelineRelations } from "@/utils/timeline-utils";

import VerticalTimelineEntry from "./vertical-timeline-entry.vue";

const t = useTranslations();
const props = defineProps<{
	isOpen: boolean;
	closeModal: () => void;
	relations: Array<TimelineObject>;
}>();

// Fiter relations by start_date
const filteredRelations = computed<Array<TimelineObject>>(() =>
	props.relations.filter((r) => selectedClasses.value.includes(r.class)),
);

// Group relations by date
const groupedRelations = computed(() => groupTimelineRelations(filteredRelations.value));

const availableClasses = computed(() => [...new Set(props.relations.map((r) => r.class))]);
const selectedClasses = ref(availableClasses.value);
</script>

<template>
	<TransitionRoot appear :show="isOpen" as="template">
		<Dialog as="div" class="relative z-10" @close="closeModal">
			<TransitionChild
				as="template"
				enter="duration-300 ease-out"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="duration-200 ease-in"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div class="fixed inset-0 bg-black/25" />
			</TransitionChild>

			<div class="fixed inset-0 overflow-y-auto">
				<div class="flex min-h-full items-center justify-center p-4 text-center">
					<TransitionChild
						as="template"
						enter="duration-300 ease-out"
						enter-from="opacity-0 scale-95"
						enter-to="opacity-100 scale-100"
						leave="duration-200 ease-in"
						leave-from="opacity-100 scale-100"
						leave-to="opacity-0 scale-95"
					>
						<DialogPanel
							class="rounded relative w-full max-w-md overflow-hidden bg-white p-6 text-left align-middle shadow-xl transition-all md:max-w-lg dark:bg-neutral-800"
						>
							<h2 class="text-2xl">{{ t("Timeline.timeline") }}</h2>
							<button class="absolute right-2 top-2" @click="closeModal">
								<X class="size-4 text-neutral-500"></X>
							</button>
							<Listbox v-model="selectedClasses" multiple>
								<div class="relative mb-4 mt-1">
									<ListboxButton
										class="relative w-full cursor-pointer rounded-lg bg-inherit py-2 pr-10 text-left sm:text-sm"
									>
										<span
											v-for="className in selectedClasses"
											:key="className"
											class="mx-0.5 truncate rounded-md px-2 py-1"
											:class="[bgColorsSemiTransparent[className]]"
										>
											{{ t(`Pages.searchviews.${className}.label`) }}
										</span>
										<span
											class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
										>
											<ChevronDown class="size-5 text-neutral-400" aria-hidden="true" />
										</span>
									</ListboxButton>

									<Transition
										leave-active-class="transition duration-100 ease-in"
										leave-from-class="opacity-100"
										leave-to-class="opacity-0"
									>
										<ListboxOptions
											class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 sm:text-sm dark:bg-neutral-900"
										>
											<ListboxOption
												v-for="className in availableClasses"
												v-slot="{ active, selected }"
												:key="className"
												:value="className"
												as="template"
											>
												<li
													:class="[
														active
															? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
															: 'text-neutral-900 dark:text-neutral-100',
														'relative cursor-pointer select-none py-2 pl-10 pr-4',
													]"
												>
													<span
														:class="[selected ? 'font-medium' : 'font-normal', 'block truncate']"
													>
														{{ t(`Pages.searchviews.${className}.label`) }}
													</span>
													<span
														v-if="selected"
														class="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600"
													>
														<Check class="size-5" aria-hidden="true" />
													</span>
												</li>
											</ListboxOption>
										</ListboxOptions>
									</Transition>
								</div>
							</Listbox>
							<div class="relative h-auto">
								<!-- Vertical line -->
								<div class="absolute left-1/2 mx-auto -ml-0.5 h-full w-1 bg-neutral-300"></div>

								<VerticalTimelineEntry
									v-for="(r, idx) in groupedRelations"
									:key="idx"
									:item="r"
									:position="idx % 2 == 0 ? 'left' : 'right'"
								></VerticalTimelineEntry>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>
