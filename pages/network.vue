<script lang="ts" setup>
import NetworkVisualization from "@/components/networkVisualization.vue";

const t = useTranslations();
definePageMeta({
	title: "Pages.network.title",
});
</script>

<template>
	<MainContent class="container grid grid-rows-[auto_1fr] content-start gap-y-8 py-8">
		<PageTitle>{{ t("Pages.network.title") }}</PageTitle>
		<NetworkVisualization></NetworkVisualization>
	</MainContent>
</template>
