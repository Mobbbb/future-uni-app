<template>
	<view class="dialog-wrap">
		<view class="dialog-item mb-8" @click="setClipboardData('mobbbb.top@gmail.com', '邮箱已复制')">
			<uni-icons type="email-filled" size="20" color="#606266"></uni-icons><text class="dialog-title">mobbbb.top@gmail.com</text>
		</view>
		<view class="dialog-item" @click="setClipboardData('_Silver_', '微信已复制')">
			<uni-icons type="weixin" size="20" color="#606266"></uni-icons><text class="dialog-title">_Silver_</text>
		</view>
	</view>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const setClipboardData = (value, msg) => {
	uni.setClipboardData({
		data: value,
		success: function() {
			ElMessage.success(msg)
		}
	})
}
</script>

<style scoped lang="scss">
.dialog-wrap {
	font-size: 12px;
	line-height: 20px;
}
.dialog-title {
	margin-left: 8px;
	padding-bottom: 2px;
}
.dialog-title:active {
	color: #a1a1a1;
}
.dialog-item {
	display: flex;
	align-items: center;
}
</style>
