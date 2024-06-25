<script lang="ts" setup>
import { Search } from "lucide-vue-next";

import type { FacetType } from "@/types/resulttypes";

const t = useTranslations();

const model = defineModel({ type: Array<FacetType>, required: true });
const props = defineProps<{
	options: Array<FacetType>;
}>();

const input = ref<string>("");
const selection = ref<Array<FacetType>>([]);
const displayedOptions = computed(() => {
	if (input.value.length > 0)
		return props.options.filter((o) => o.name.toLowerCase().includes(input.value.toLowerCase()));
	else return props.options;
});
watch(selection, (s) => (model.value = s));
const showAllOptions = ref<boolean>(false);
const maxResultsToDisplay = 5;
</script>

<template>
	<div>
		<div class="mb-2 grid h-8 w-full shrink-0 grid-cols-[auto_1fr_auto] items-center rounded-md">
			<label for="searchinput">
				<Search class="mr-3 size-4 shrink-0 text-neutral-500" />
				<span class="sr-only">
					{{ t("ui.search-placeholder") }}
				</span>
			</label>
			<input
				id="searchinput"
				v-model="input"
				type="text"
				class="h-full bg-transparent"
				:placeholder="t('ui.search-placeholder')"
			/>
		</div>
		<ul class="max-h-52 overflow-auto">
			<li
				v-for="option in showAllOptions
					? displayedOptions
					: displayedOptions.slice(0, maxResultsToDisplay)"
				:key="option.id"
				class="my-1 hover:font-medium"
			>
				<label
					class="relative flex cursor-default select-none justify-between pr-4"
					:title="option.name"
				>
					<input v-model="selection" type="checkbox" :value="option" />

					<span
						class="inline-block grow truncate px-2 text-start"
						:class="{
							'font-medium': selection.includes(option),
						}"
					>
						{{ option.name }}
					</span>
					<span class="my-auto ml-2 text-xs">{{ option.count }}</span>
				</label>
			</li>
		</ul>
		<button
			v-if="options.length > maxResultsToDisplay"
			class="mt-2 cursor-pointer font-normal hover:font-medium"
			@click="showAllOptions = !showAllOptions"
		>
			{{
				showAllOptions
					? t("ui.hide-results")
					: t("ui.show-all", {
							all: displayedOptions.length,
						})
			}}
		</button>
	</div>
</template>
