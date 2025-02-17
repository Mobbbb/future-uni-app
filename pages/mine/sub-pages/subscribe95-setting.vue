<template>
	<ux-nav>油价订阅</ux-nav>
	<view class="subscribe-wrap">
		<view class="tips">
			<view><text style="font-weight: bold;color: #3b4144;margin-right: 8px;">· 第一步</text>设置邮箱</view>
			<text v-if="userEmail">已设置</text>
			<text class="setting-text" v-else @click="toEmailPage">去设置</text>
		</view>
		<view class="tips">
			<view><text style="font-weight: bold;color: #3b4144;margin-right: 8px;">· 第二步</text>开启订阅</view>
			<view @click="clickSwitch">
				<switch class="switch-btn" :disabled="!userEmail" :checked="status" color="rgb(4, 190, 2)" @change="switchChange" />
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { updateSubscribe95 } from '@/request.api/index.js'

const store = new useStore()

const status = ref(false)

const userEmail = computed(() => store.state.app.USER_INFO.email || '')
const remoteStatus = computed(() => store.state.app.USER_INFO.subscribe95 || 0)

const setSubscribe95 = (status) => store.commit('app/setSubscribe95', status)

const toEmailPage = () => {
	uni.navigateTo({
		url: '/pages/mine/sub-pages/email-setting',
	})
}

const switchChange = async (params) => {
	status.value = params.detail.value
	const res = await updateSubscribe95(status.value ? 1 : 0)
	if (res.success) {
		ElMessage.success(status.value ? '已开启' : '已关闭')
		setSubscribe95(status.value)
	}
}

const clickSwitch = () => {
	if (!userEmail.value) {
		ElMessage.error('请先设置邮箱')
	}
}

watch(remoteStatus, (value) => {
	if (value) {
		status.value = !!remoteStatus.value
	}
})

onMounted(() => {
	status.value = !!remoteStatus.value
})

</script>

<style scoped lang="scss">
.subscribe-wrap {
	background-color: #fff;
	margin: 0;
	padding-top: 16px;
}
.tips {
	padding: 12px;
	background-color: rgb(245, 246, 247);
	color: #999;
	font-size: 14px;
	display: flex;
	justify-content: space-between;
	margin-bottom: 16px;
	position: relative;
}
.setting-text {
	color: #628dd1;
}
.switch-btn {
	transform: scale(0.7);
	position: absolute;
	right: 0;
	top: 0;
	bottom: 0;
	margin: auto 0;
	height: 32px;
}
</style>
