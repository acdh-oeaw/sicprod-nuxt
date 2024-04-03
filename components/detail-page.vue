<script lang="ts" setup>
import { Loader2 } from "lucide-vue-next";

import Centered from "@/components/ui/centered.vue";

const t = useTranslations();

defineProps<{
	model: string;
	detailsLoading: boolean;
}>();
</script>

<template>
	<div class="mx-auto size-full max-w-container px-2 py-4 xl:px-0">
		<!-- <h2 class="text-lg text-gray-500 lg:text-2xl">{{ t("DetailPage.basedata") }} - {{ model }}</h2> -->
		<slot name="head" />
		<div class="mt-8 grid gap-16 md:grid-cols-[2fr_3fr]">
			<div class="flex flex-col gap-8">
				<div>
					<h2 class="text-gray-500 text-2xl">{{ t("DetailPage.basedata") }}</h2>
					<div class="grid grid-cols-2">
						<slot name="base" />
					</div>
				</div>

				<div v-if="!detailsLoading">
					<slot name="left" />
				</div>
				<Centered v-else>
					<Loader2 class="size-8 animate-spin" />
				</Centered>
			</div>
			<div v-if="!detailsLoading">
				<slot name="right" />
			</div>
			<Centered v-else>
				<Loader2 class="size-8 animate-spin" />
			</Centered>
		</div>
	</div>
</template>
