<template>
    <view class="switch-wrap" :style="props.size === 'small' ? { transform: 'scale(0.8)' } : {}">
		<switch class="ux-switch" :color="props.activeColor" :checked="props.modelValue" @change="switchChange" />
		<text class="switch-text" @click="clickLabel" :style="style">{{ showText }}</text>
	</view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	activeText: {
		type: String,
		default: '',
	},
	inactiveText: {
		type: String,
		default: '',
	},
	activeColor: {
		type: String,
		default: '',
	},
	size: {
		type: String,
		default: '',
	},
})

const showText = computed(() => props.modelValue ? props.activeText : props.inactiveText)

const style = computed(() => props.modelValue ? {} : {
	marginLeft: '29px',
	color: '#000',
})

const emits = defineEmits(['update:modelValue', 'change'])

const switchChange = (e) => {
	emits('update:modelValue', e.detail.value)
	emits('change', e.detail.value)
}

const clickLabel = () => {
	emits('update:modelValue', !props.modelValue)
	emits('change', !props.modelValue)
}
</script>

<style scoped>
.switch-wrap {
	position: relative;
}
.switch-text {
	left: 5px;
	top: 0;
	line-height: 30px;
	position: absolute;
	transition: all .3s;
	color: white;
	font-size: 12px;
}
</style>
