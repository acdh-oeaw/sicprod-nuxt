<script lang="ts" setup>
import NetworkVisualization from "@/components/networkVisualization.vue";

const t = useTranslations();
definePageMeta({
	title: "Pages.network.title",
});
</script>

<template>
	<MainContent class="container grid grid-rows-[1fr] content-start gap-y-8 py-8">
		<PageTitle class="sr-only">{{ t("Pages.network.title") }}</PageTitle>
		<NetworkVisualization></NetworkVisualization>
	</MainContent>
</template>
