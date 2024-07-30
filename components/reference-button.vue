<!-- eslint-disable vue/no-v-html -->
<script setup lang="ts">
import { offset, type Placement, shift, useFloating } from "@floating-ui/vue";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
// @ts-expect-error missing types for citation-js
import Cite from "citation-js";
import { ArrowDownToLine, BookOpenText } from "lucide-vue-next";

import type { Reference } from "@/types/resulttypes";
import styleSheet from "~/assets/sicprod-style.csl?raw";

const t = useTranslations();
const props = withDefaults(
	defineProps<{
		references: Array<Reference>;
		popupPosition?: Placement;
		popupOffset?: number;
	}>(),
	{ popupPosition: "top", popupOffset: 12, references: () => [] },
);
// Popover positioning using floatingUI
const reference = ref(null);
const floating = ref(null);
const { floatingStyles } = useFloating(reference, floating, {
	transform: false,
	placement: props.popupPosition,
	middleware: [offset(props.popupOffset), shift({ padding: 8 })],
});

let config = Cite.plugins.config.get("@csl");
config.templates.add("sicprod-stylesheet", styleSheet);
const citationConfig = {
	format: "html",
	template: "sicprod-stylesheet",
	lang: "en-EN",
};
const citation = computed(() => {
	let c = props.references.map(
		(r) =>
			new Cite({
				...r.bibtex,
				note: r.folio,
				page: [...new Set([r.pages_start, r.pages_end])].join("-"),
			}),
	);
	return c;
});
function downloadBibTex() {
	const blob = new Blob(
		citation.value.map((c) => c.format("bibtex")),
		{ type: "text/plain;charset=utf-8;" },
	);
	window.open(URL.createObjectURL(blob), "_blank");
}
</script>

<template>
	<Popover>
		<PopoverButton
			ref="reference"
			class="group inline-flex size-full scale-90 items-center rounded-md font-medium text-neutral-600 transition-transform hover:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 dark:text-neutral-200"
		>
			<BookOpenText class="mx-auto size-full" />
			<span class="sr-only">{{ t("References.references") }}</span>
		</PopoverButton>
		<Transition
			enter-active-class="transition duration-200 ease-out"
			enter-from-class="translate-y-1 opacity-0"
			enter-to-class="translate-y-0 opacity-100"
			leave-active-class="transition duration-150 ease-in"
			leave-from-class="translate-y-0 opacity-100"
			leave-to-class="translate-y-1 opacity-0"
		>
			<PopoverPanel
				ref="floating"
				class="z-10 max-h-96 max-w-72 cursor-auto overflow-auto rounded-lg shadow-lg ring-1 ring-black/5"
				:style="{ ...floatingStyles }"
				@click.stop.prevent
			>
				<div class="overflow-auto bg-neutral-50 p-4 text-sm dark:bg-neutral-800">
					<div class="ml-auto flex w-fit">
						<button :title="t('References.download-bibtex')" @click.stop.prevent="downloadBibTex()">
							<ArrowDownToLine class="size-4 transition-transform hover:scale-125" />
						</button>
					</div>
					<div
						v-for="(entry, idx) in citation"
						:key="entry"
						class="py-2"
						:class="{ 'border-b-2 dark:border-neutral-700': idx < citation.length - 1 }"
						v-html="entry.format('bibliography', citationConfig)"
					></div>
				</div>
			</PopoverPanel>
		</Transition>
	</Popover>
</template>
