<template>
	<!-- eslint-disable tailwindcss/no-custom-classname -->
	<div class="dots-3"></div>
	<span class="sr-only">Loading</span>
</template>

<style>
.dots-3 {
	--_g: no-repeat radial-gradient(farthest-side, currentColor 94%, #0000);

	position: relative;
	width: 50px;
	height: 28px;
	background:
		var(--_g) 50% 0,
		var(--_g) 100% 0;
	background-size: 12px 12px;
	animation: d3-0 1.5s linear infinite;
}

.dots-3::before {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	height: 12px;
	border-radius: 50%;
	background: currentColor;
	animation:
		d3-1 1.5s linear infinite,
		d3-2 0.5s cubic-bezier(0, 200, 0.8, 200) infinite;
	aspect-ratio: 1;
}

@keyframes d3-0 {
	0%,
	31% {
		background-position:
			50% 0,
			100% 0;
	}

	33% {
		background-position:
			50% 100%,
			100% 0;
	}

	43%,
	64% {
		background-position:
			50% 0,
			100% 0;
	}

	66% {
		background-position:
			50% 0,
			100% 100%;
	}

	79% {
		background-position:
			50% 0,
			100% 0;
	}

	100% {
		transform: translateX(calc(-100% / 3));
	}
}

@keyframes d3-1 {
	100% {
		left: calc(100% + 7px);
	}
}

@keyframes d3-2 {
	100% {
		top: -0.1px;
	}
}
</style>
