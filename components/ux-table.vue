<template>
	<view class="ux-table table-fixed" :class="props.fixed">
		<slot></slot>
		<view class="empty-text" v-if="!props.data.length">没有更多数据</view>
		<view class="uni-table-mask" v-if="props.loading">
			<view class="uni-table--loader"></view>
		</view>
	</view>
</template>

<script setup>
import { computed, toRefs } from 'vue'

const props = defineProps({
	fixed: {
		type: String,
		default: '',
	},
	data: {
		type: Array,
		default() {
			return []
		}
	},
	loading: {
		type: Boolean,
		default: false,
	},
})

</script>

<style lang="scss">
$border-color: #ebeef5;

.ux-table {
	position: relative;
	height: 100%;
}
.empty-text {
	position: absolute;
	right: 0;
	left: 0;
	width: 100px;
	text-align: center;
	font-size: 14px;
	color: #999;
	top: 44px;
	bottom: 0;
	height: 40px;
	line-height: 40px;
	margin: auto;
}

.uni-table-mask {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: rgba(255, 255, 255, 0.9);
	z-index: 99;
	/* #ifndef APP-NVUE */
	display: flex;
	margin: auto;
	transition: all 0.5s;
	/* #endif */
	justify-content: center;
	align-items: center;
}

.uni-table--loader {
	width: 30px;
	height: 30px;
	border: 2px solid #aaa;
	// border-bottom-color: transparent;
	border-radius: 50%;
	/* #ifndef APP-NVUE */
	animation: 2s uni-table--loader linear infinite;
	/* #endif */
	position: relative;
}

@keyframes uni-table--loader {
	0% {
		transform: rotate(360deg);
	}

	10% {
		border-left-color: transparent;
	}

	20% {
		border-bottom-color: transparent;
	}

	30% {
		border-right-color: transparent;
	}

	40% {
		border-top-color: transparent;
	}

	50% {
		transform: rotate(0deg);
	}

	60% {
		border-top-color: transparent;
	}

	70% {
		border-left-color: transparent;
	}

	80% {
		border-bottom-color: transparent;
	}

	90% {
		border-right-color: transparent;
	}

	100% {
		transform: rotate(-360deg);
	}
}
</style>
