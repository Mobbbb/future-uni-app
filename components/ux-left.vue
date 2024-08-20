<template>
	<view class="ux-icon" :style="style">
		<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
			<path fill="currentColor" d="M529.408 149.376a29.12 29.12 0 0 1 41.728 0 30.592 30.592 0 0 1 0 42.688L259.264 511.936l311.872 319.936a30.592 30.592 0 0 1-.512 43.264 29.12 29.12 0 0 1-41.216-.512L197.76 534.272a32 32 0 0 1 0-44.672l331.648-340.224zm256 0a29.12 29.12 0 0 1 41.728 0 30.592 30.592 0 0 1 0 42.688L515.264 511.936l311.872 319.936a30.592 30.592 0 0 1-.512 43.264 29.12 29.12 0 0 1-41.216-.512L453.76 534.272a32 32 0 0 1 0-44.672l331.648-340.224z"></path>
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
	margin-right: 6px;
}
.ux-icon svg {
    height: 1em;
    width: 1em;
}
</style>
