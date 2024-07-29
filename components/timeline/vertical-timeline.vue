<script setup lang="ts">
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from "@headlessui/vue";

import type { TimelineObject } from "@/types/timeline";
import { groupTimelineRelations } from "@/utils/timeline-utils";

import VerticalTimelineEntry from "./vertical-timeline-entry.vue";

const props = defineProps<{
	isOpen: boolean;
	closeModal: () => void;
	relations: Array<TimelineObject>;
}>();

// Fiter relations by start_date
const filteredRelations = computed<Array<TimelineObject>>(() =>
	props.relations.filter((r): r is TimelineObject => Boolean(r.start_date)),
);

// Group relations by date
const groupedRelations = computed(() => groupTimelineRelations(filteredRelations.value));
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
							class="rounded w-full max-w-md overflow-hidden bg-white p-6 text-left align-middle shadow-xl transition-all"
						>
							<div class="relative mt-2 h-auto pt-4">
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
