<template>
	<view class="ux-icon" :style="style">
		<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
			<path fill="currentColor" d="M452.864 149.312a29.12 29.12 0 0 1 41.728.064L826.24 489.664a32 32 0 0 1 0 44.672L494.592 874.624a29.12 29.12 0 0 1-41.728 0 30.592 30.592 0 0 1 0-42.752L764.736 512 452.864 192a30.592 30.592 0 0 1 0-42.688zm-256 0a29.12 29.12 0 0 1 41.728.064L570.24 489.664a32 32 0 0 1 0 44.672L238.592 874.624a29.12 29.12 0 0 1-41.728 0 30.592 30.592 0 0 1 0-42.752L508.736 512 196.864 192a30.592 30.592 0 0 1 0-42.688z"></path>
		</svg>
	</view>
</template>

<script setup>
import { computed, toRefs, defineProps } from 'vue'

const props = defineProps({
	color: {
		type: String,
		default: '#000',
	},
	size: {
		type: String,
		default: '16',
	},
})

const style = computed(() => ({
	color: props.color,
	fontSize: `${props.size}px`,
}))
</script>

<style lang="scss">
.ux-icon {
	height: 1em;
	width: 1em;
	line-height: 1em;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	position: relative;
	fill: currentColor;
	margin-left: 6px;
}
.ux-icon svg {
    height: 1em;
    width: 1em;
}
</style>
