<script lang="ts" setup>
const t = useTranslations();

usePageMetadata({
	title: t("NetworkPage.meta.title"),
});
</script>

<template>
	<MainContent class="relative">
		<PageTitle class="sr-only">{{ t("NetworkPage.title") }}</PageTitle>
		<NetworkVisualization />
	</MainContent>
</template>
