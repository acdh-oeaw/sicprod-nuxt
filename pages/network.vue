<script lang="ts" setup>
import NetworkVisualization from "@/components/networkVisualization.vue";

const t = useTranslations();
definePageMeta({
	title: "Pages.network.title",
});
</script>

<template>
	<MainContent class="relative grid grid-rows-[1fr] gap-y-8 py-8">
		<PageTitle class="sr-only">{{ t("Pages.network.title") }}</PageTitle>
		<NetworkVisualization></NetworkVisualization>
	</MainContent>
</template>
