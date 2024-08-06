<template>
	<view class="mine-wrap">
		<view class="mine-top-wrap" v-if="isLogin">
			<img class="avatar-img" :src="avatarImg" v-if="avatarImg">
			<view class="avatar-wrap">
				<uni-icons color="#656565" type="person-filled" size="30"></uni-icons>
			</view>
			<view class="login-text">{{USER_INFO.userId}}</view>
		</view>
		<view class="mine-top-wrap" @click="login" v-else>
			<view class="avatar-wrap">
				<uni-icons color="#656565" type="person-filled" size="30"></uni-icons>
			</view>
			<view class="login-text">登录</view>
		</view>
		<uni-card margin="10px 0">
			<text>这里是个人信息页面，功能开发中，暂未开放......</text>
		</uni-card>
		<uni-card margin="10px 0">
			<text>这里是个人信息页面，功能开发中，暂未开放......</text>
		</uni-card>
        <button v-if="isLogin" style="background-color: #eb4436;margin-top: 24px;" type="primary" @click="logout">退出登录</button>
	</view>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useStore } from 'vuex'
import { getAppendBlock, getCacheList, dateFormat } from '@/utils/index.js'
import { baseUrl } from '@/request.api/index.js'

const store = new useStore()

const isLogin = computed(() => store.getters['app/isLogin'])
const USER_INFO = computed(() => store.state.app.USER_INFO)

const avatarImg = computed(() => {
	const { avatar } = USER_INFO.value
	if (avatar) {
		// #ifdef MP-WEIXIN
		return baseUrl + avatar
		// #endif
		
		// #ifndef MP-WEIXIN
		return avatar
		// #endif
	}

	return ''
})

const setLoginDrawerStatus = (status) => store.commit('app/setLoginDrawerStatus', status)
const logoutAction = () => store.dispatch('app/logoutAction')

const login = () => {
	setLoginDrawerStatus(true)
}

const logout = () => {
	logoutAction()
}

</script>

<style lang="scss">
page {
	background-color: $base-background-color;
	overflow-y: scroll;
}
</style>

<style scoped>
.mine-wrap {
	width: calc(100% - 48px);
	margin: 0 24px;
	font-size: 14px;
}
.mine-top-wrap {
	display: flex;
	align-items: center;
	padding: 12px 0 24px 0;
}
.avatar-wrap {
	width: 60px;
	height: 60px;
	border-radius: 60px;
	background-color: #c9c9c9;
	margin-right: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
}
.login-text {
	font-weight: bold;
	font-size: 20px;
}
.avatar-img {
	width: 60px;
	height: 60px;
	border-radius: 60px;
	margin-right: 16px;
}
</style>
