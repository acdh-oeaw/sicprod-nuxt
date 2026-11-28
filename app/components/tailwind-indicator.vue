<script lang="ts" setup>
const isVisible = import.meta.dev;
</script>

<template>
	<div
		v-if="isVisible"
		class="bg-on-background text-background fixed right-4 bottom-4 z-10 grid size-8 place-content-center rounded-full font-mono text-xs font-medium select-none"
	>
		<span class="xs:hidden">2xs</span>
		<span class="max-xs:hidden sm:hidden">xs</span>
		<span class="max-sm:hidden md:hidden">sm</span>
		<span class="max-md:hidden lg:hidden">md</span>
		<span class="max-lg:hidden xl:hidden">lg</span>
		<span class="max-xl:hidden 2xl:hidden">xl</span>
		<span class="3xl:hidden max-2xl:hidden">2xl</span>
		<span class="max-3xl:hidden">3xl</span>
	</div>
</template>
