<script lang="ts" setup>
import { get } from "@acdh-oeaw/lib";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronDown } from "lucide-vue-next";

import ReferenceButton from "@/components/reference-button.vue";
import Centered from "@/components/ui/centered.vue";
import Loader from "@/components/ui/loader.vue";
import { borderColors, icons, scrollbarColors, textColors } from "@/lib/colors";
import type { ModelString, TempTriple } from "@/types/resulttypes";

const props = withDefaults(
	defineProps<{
		rels?: Array<TempTriple>;
		gridClass?: string;
		title: string;
		defaultOpen?: boolean;
		headers: Array<string>;
		customSlot?: boolean;
		detailsLoading?: boolean;
		model: ModelString;
	}>(),
	{
		rels: () => {
			return [];
		},
	},
);

const t = useTranslations();

const groupedRelations = computed(() => {
	const groups: Record<string, Array<TempTriple>> = {};

	if (props.detailsLoading) {
		return groups;
	}

	for (const rel of props.rels) {
		const prop = rel.to.name;
		if (!(prop in groups)) {
			groups[prop] = [];
		}
		(groups[prop] ?? []).push(rel);
	}
	return groups;
});
</script>

<template>
	<Disclosure
		as="div"
		class=""
		:default-open="defaultOpen && (detailsLoading || rels.length != 0 || customSlot)"
	>
		<DisclosureButton
			as="button"
			class="rounded flex w-full items-center justify-between border-b-4 p-2 text-xl transition ui-open:rounded-b-none"
			:class="borderColors[model]"
		>
			<span class="flex gap-2 align-baseline">
				<component :is="icons[model]" class="inline" />
				{{ title }}
			</span>
			<ChevronDown class="size-5 transition ui-open:-rotate-180" />
		</DisclosureButton>
		<DisclosurePanel
			as="div"
			class="rounded box-border overflow-hidden rounded-t-none p-4 transition-[max-height,border,padding] ui-open:max-h-full ui-open:border-t-0 ui-not-open:max-h-0 ui-not-open:border-transparent ui-not-open:py-0"
			static
		>
			<slot v-if="(!detailsLoading && rels.length !== 0 && headers) || customSlot">
				<table class="w-full table-fixed">
					<thead class="table w-full table-fixed">
						<tr class="">
							<th v-for="header in headers" :key="header" class="p-2 text-start font-bold">
								{{ t(`Relations.${model}.${header}`) }}
							</th>
						</tr>
					</thead>
					<tbody
						class="block max-h-screen w-full table-fixed overflow-auto scrollbar-thin scrollbar-track-transparent"
						:class="scrollbarColors[model]"
					>
						<component
							:is="rel.length > 1 ? Disclosure : 'tbody'"
							v-for="rel of groupedRelations"
							:key="rel[0]?.to?.name"
							as="tbody"
							class="w-full border-t md:border-t dark:hover:bg-primary-950 dark:active:bg-primary-950"
						>
							<DisclosureButton
								v-if="rel.length > 1"
								as="tr"
								class="group table w-full table-fixed cursor-pointer hover:bg-primary-50 active:bg-primary-50 dark:hover:bg-primary-950 dark:active:bg-primary-950"
								role="button"
								tabindex="0"
							>
								<td
									v-for="(header, idx) in headers"
									:key="rel[0]?.to?.name + header"
									class="p-2 text-start"
								>
									{{
										header === "to.name" || rel.length === 1
											? String(get(rel[0]!, header) ?? "").replace(/\<.*?\>/g, "")
											: "*"
									}}
									<ChevronDown
										v-if="rel.length > 1 && idx === headers.length - 1"
										class="float-right size-5 transition group-hover:animate-bounce"
									/>
								</td>
							</DisclosureButton>

							<component
								:is="rel.length > 1 ? DisclosurePanel : 'tr'"
								as="tr"
								class="hover:bg-primary-50 active:bg-primary-50 dark:hover:bg-primary-950 dark:active:bg-primary-950"
							>
								<NuxtLinkLocale
									v-for="hit in rel"
									:key="String(hit)"
									class="table w-full table-fixed"
									:to="`/detail/${model}/${hit.to.id}`"
								>
									<td v-for="(header, idx) in headers" :key="hit + header" class="p-2 text-start">
										{{ String(get(hit, header) ?? "").replace(/\<.*?\>/g, "") }}
										<ReferenceButton
											v-if="
												idx === headers.length - 1 && hit.references && hit.references.length > 0
											"
											class="float-right mr-0.5 size-5"
											:references="hit.references"
										/>
									</td>
								</NuxtLinkLocale>
							</component>
						</component>
					</tbody>
				</table>
			</slot>

			<slot v-else>
				<div class="relative mt-5" :class="textColors[model]">
					<Centered>
						<Loader />
					</Centered>
				</div>
			</slot>
		</DisclosurePanel>
	</Disclosure>
</template>
