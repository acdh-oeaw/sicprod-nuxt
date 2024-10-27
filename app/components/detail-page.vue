<script lang="ts" setup>
import Centered from "@/components/ui/centered.vue";
import Loader from "@/components/ui/loader.vue";

const t = useTranslations();

defineProps<{
	model: string;
	detailsLoading?: boolean;
}>();
</script>

<template>
	<div class="grid size-full grid-rows-[1fr_auto] px-2 py-4 xl:px-0">
		<div class="mx-auto grid w-full max-w-container grid-rows-[auto_1fr]">
			<div>
				<slot name="head" />
			</div>
			<div class="mx-auto mt-16 grid w-full max-w-container gap-16 md:grid-cols-[2fr_3fr]">
				<div class="flex flex-col gap-8">
					<div>
						<h2 class="text-2xl">{{ t("DetailPage.basedata") }}</h2>
						<div class="grid grid-cols-2">
							<slot name="base" />
						</div>
					</div>

					<div v-if="!detailsLoading">
						<slot name="left" />
					</div>
					<Centered v-else>
						<Loader />
					</Centered>
				</div>
				<div v-if="!detailsLoading">
					<slot name="right" />
				</div>
				<Centered v-else>
					<Loader />
				</Centered>
			</div>
		</div>

		<div class="w-full">
			<slot name="bottom" />
		</div>
	</div>
</template>
