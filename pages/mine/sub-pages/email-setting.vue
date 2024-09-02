<template>
	<ux-nav>邮箱设置</ux-nav>
	<view class="email-config-wrap">
		<uni-easyinput prefixIcon="email" :maxlength="40" :styles="styles" v-model="email" :disabled="!editable" :clearable="false" placeholder="请输入邮箱"></uni-easyinput>
		<view class="tips">每30天可修改一次邮箱，请谨慎提交。<text v-if="editable && emailTime">上次修改时间为{{ emailTime }}</text><text v-if="!editable">距下次修改时间还剩{{ restDay }}天</text></view>
        <button class="save-btn" type="buy" :disabled="!email || !editable" @click="save">提交</button>
	</view>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { dateInterval } from '@/utils/umob.js'
import { updateUserEmail } from '@/request.api/index.js'

const store = new useStore()

const email = ref('')
const styles = {
	height: '46px',
	backgroundColor: '#f5f6f7',
}

const DAYS_AFTER = 30 * 24 * 60 * 60 * 1000

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
const isLogin = computed(() => store.getters['app/isLogin'])
const userEmail = computed(() => store.state.app.USER_INFO.email || '')
const emailTime = computed(() => store.state.app.USER_INFO.emailTime || null)
const isValidEmail = computed(() => emailRegex.test(email.value))
const restDay = computed(() => Math.ceil(dateInterval(Date.parse(new Date(emailTime.value)) + DAYS_AFTER, Date.now()) / 1000 / 60 / 60 / 24))
const editable = computed(() => emailTime.value && dateInterval(Date.now(), emailTime.value) > DAYS_AFTER || !emailTime.value)

const setEmail = (email) => store.commit('app/setEmail', email)
const INIT_USER = () => store.dispatch('app/INIT_USER')
const logoutAction = () => store.dispatch('app/logoutAction')

const save = async () => {
	if (!isLogin.value) {
		ElMessage.error('请先登录')
		logoutAction()
		return
	}
	if (isValidEmail.value) {
		const res = await updateUserEmail(email.value)
		if (res.success) {
			ElMessage.success('保存成功')
			INIT_USER()
		}
	} else {
		ElMessage.error('邮箱格式不正确')
	}
}

watch(userEmail, (value) => {
	if (value) {
		email.value = userEmail.value
	}
})

onMounted(() => {
	email.value = userEmail.value
})

</script>

<style scoped lang="scss">
.email-config-wrap {
	background-color: #fff;
	margin: 0;
	padding-top: 16px;
}
.tips {
	padding: 12px 8px;
	background-color: rgb(245, 246, 247);
	margin-top: 16px;
	color: #999;
	font-size: 12px;
}
.save-btn {
	margin: 36px 24px 0 24px;
	border-radius: 50px;
	font-size: 15px;
}
</style>

<style>
.email-config-wrap .uni-easyinput__content {
	border-color: transparent!important;
	border-radius: 0;
}
.email-config-wrap .uni-easyinput__content-input {
	height: 46px;
}
</style>
