<template>
	<view class="mine-wrap">
		<view class="mine-top-wrap" v-if="isLogin">
			<img class="avatar-img" :src="avatarImg" v-if="avatarImg">
			<view class="avatar-wrap" v-else>
				<uni-icons color="#656565" type="person-filled" size="30"></uni-icons>
			</view>
			<view class="login-text">{{ USER_INFO.name }}</view>
		</view>
		<view class="mine-top-wrap" @click="login" v-else>
			<view class="avatar-wrap">
				<uni-icons color="#656565" type="person-filled" size="30"></uni-icons>
			</view>
			<view class="login-text">登录</view>
		</view>
		<uni-card margin="10px 0" padding="0">
			<uni-list>
				<uni-list-item title="优先平今" link to="/pages/mine/sub-pages/close-setting" note="设置优先平仓的品种" showArrow
					:thumb="base64.set"
					thumb-size="medium" rightText="去设置" />
				<uni-list-item title="品种简介" link to="/pages/mine/sub-pages/introduction" note="合约详细信息" showArrow
					:thumb="base64.list"
					thumb-size="medium" rightText="去查看" />
				<uni-list-item title="邮件通知" note="价格波动邮件提醒" showArrow
					:thumb="base64.mail"
					thumb-size="medium" rightText="已设置" />
			</uni-list>
		</uni-card>
        <button v-if="isLogin" style="background-color: #eb4436;margin-top: 24px;" type="primary" @click="logout">退出登录</button>
	</view>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useStore } from 'vuex'
import { baseUrl } from '@/request.api/index.js'
import base64 from '@/config/base64.js'

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

<style scoped lang="scss">
.mine-wrap {
	padding: 0 $page-padding;
}
.mine-top-wrap {
	display: flex;
	align-items: center;
	padding: 10px 0 24px 0;
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
