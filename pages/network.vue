<script lang="ts" setup>
import NetworkVisualization from "@/components/networkVisualization.vue";

const t = useTranslations();
definePageMeta({
	title: "Pages.network.title",
});
</script>

<template>
	<MainContent class="relative">
		<PageTitle class="sr-only">{{ t("Pages.network.title") }}</PageTitle>
		<NetworkVisualization></NetworkVisualization>
	</MainContent>
</template>
