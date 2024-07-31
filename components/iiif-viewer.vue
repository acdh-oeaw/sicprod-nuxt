<script setup lang="ts">
import "tify/dist/tify.css";
import "tify";

onMounted(() => {
	//@ts-expect-error no Tify export
	new Tify({
		container: "#tify",
		manifestUrl: "https://manifests.sub.uni-goettingen.de/iiif/presentation/PPN857449303/manifest",
	});
});
</script>

<template>
	<div id="tify" class="h-full"></div>
</template>
