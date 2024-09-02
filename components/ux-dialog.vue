<template>
	<view class="ux-dialog" :class="props.fixedWidth ? 'ux-dialog-fixed-width' : ''">
		<uni-popup ref="dialog" type="dialog" @change="change">
			<view class="popup-wrap">
				<slot></slot>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	fixedWidth: {
		type: Boolean,
		default: false,
	},
})

const emits = defineEmits(['update:modelValue'])

const dialog = ref(null)

const change = (value) => {
	if (!value.show) {
		emits('update:modelValue', false)
	}
}

watch(
	() => props.modelValue, // 提供一个 getter 函数
	(value) => {
		if (value) {
			dialog.value.open()
		}
	}
)

</script>

<style lang="scss">
.ux-dialog .uni-popup__wrapper {
	max-width: 100%;
}

.ux-dialog .popup-wrap {
	background-color: white;
	border-radius: 4px;
	padding: 12px;
	max-width: 100%;
	box-sizing: border-box;
	margin: 0 12px;
	word-wrap: break-word;
}
.ux-dialog-fixed-width .popup-wrap {
	width: 100%;
}
</style>
