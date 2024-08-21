<template>
	<view class="ux-icon" :style="style" @click="clickHandle"></view>
</template>

<script setup>
import { computed, toRefs, defineProps, defineEmits } from 'vue'
import base64 from '@/config/base64.js'

const props = defineProps({
	type: {
		type: String,
		default: 'left',
	},
	size: {
		type: String,
		default: '16',
	},
	left: {
		type: String,
		default: '0',
	},
	right: {
		type: String,
		default: '0',
	},
})

const emits = defineEmits(['click'])

const style = computed(() => ({
	fontSize: `${props.size}px`,
	margin: `0 ${props.right}px 0 ${props.left}px`,
	backgroundImage: `url(${base64[props.type] || ''})`,
}))

const clickHandle = () => {
	emits('click')
}
</script>

<style scoped lang="scss">
.ux-icon {
	height: 1em;
	width: 1em;
	background-repeat: no-repeat;
	background-size: 100%;
}
</style>
