<script lang="ts" setup>
defineRouteRules({
	prerender: true,
});

const t = useTranslations();

usePageMetadata({
	title: t("ImprintPage.meta.title"),
});
</script>

<template>
	<MainContent class="container grid max-w-screen-lg content-start gap-y-8 py-8 lg:py-16">
		<PageTitle>{{ t("ImprintPage.title") }}</PageTitle>
		<Imprint />
	</MainContent>
</template>
