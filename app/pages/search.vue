<script lang="ts" setup>
const t = useTranslations();

usePageMeta({
	title: t("Pages.searchviews.title"),
});
</script>

<template>
	<main class="max-w-[100dvw]">
		<NuxtPage />
	</main>
</template>
