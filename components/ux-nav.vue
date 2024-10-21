<template>
	<view class="ux-nav">
		<view class="block-bar" :style="style"></view>
		<view class="fixed-nav" :style="{ background: props.background, height: `${navBarHeight + statusBarHeight}px` }">
			<view class="status-bar" :style="statusBarStyle"></view>
			<view class="nav-bar" :style="navBarStyle">
				<view class="icon-wrap" v-if="props.showBack" @click="backHandle">
					<uni-icons type="left" size="20" :color="color"></uni-icons>
				</view>
				<view :style="{ color: color }" class="title-wrap" :class="props.center ? 'center' : ''">
					<slot></slot>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { getMenuButtonBoundingClientRect } from '@/utils/index.js'

/**
 * @property {Boolean} showBack 是否显示返回按钮
 * @property {String} color 标题文字颜色
 * @property {String} background 背景颜色
 * @property {Boolean} center 标题文字是否居中
 */
const props = defineProps({
	showBack: {
		type: Boolean,
		default: true,
	},
	color: {
		type: String,
		default: '#000',
	},
	background: {
		type: String,
		default: '#fff',
	},
	center: {
		type: Boolean,
		default: true,
	},
})

const style = ref({})

const statusBarStyle = ref({})

const navBarStyle = ref({})

const navBarHeight = ref(0)
const statusBarHeight = ref(0)

const backHandle = () => {
	if (getCurrentPages().length > 1) {
		uni.navigateBack()
	} else {
		uni.switchTab({
			url: '/pages/mine/index',
		})
	}
}

const genNavStyle = async () => {
	const res = getMenuButtonBoundingClientRect()
	navBarHeight.value = res.navBarHeight
	statusBarHeight.value = res.statusBarHeight

	style.value = {
		height: `${navBarHeight.value + statusBarHeight.value}px`,
	}
	statusBarStyle.value = {
		height: `${statusBarHeight.value}px`,
	}
	navBarStyle.value = {
		height: `${navBarHeight.value}px`,
	}
}

genNavStyle()
</script>

<style scoped lang="scss">
.ux-nav {
	width: 100%;
	flex-shrink: 0;
}
.nav-bar {
	display: flex;
	align-items: center;
	position: relative;
}
.fixed-nav {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 9;
}
.icon-wrap {
	margin-left: 9px;
}
.title-wrap {
	font-size: 16px;
	height: 20px;
	line-height: 20px;
	font-weight: bold;
}
.center {
	position: absolute;
	left: 70px;
	right: 70px;
	min-width: 0;
	text-align: center;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
</style>
