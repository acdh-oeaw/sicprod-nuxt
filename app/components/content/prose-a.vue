<script lang="ts" setup>
const props = defineProps<{
	href: string;
	target?: "_blank";
}>();
</script>

<template>
	<NuxtLinkLocale v-bind="props">
		<slot />
	</NuxtLinkLocale>
</template>
