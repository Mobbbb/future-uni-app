<template>
	<view class="email-config-wrap">
		<uni-easyinput prefixIcon="email" :styles="styles" v-model="email" :clearable="false" placeholder="请输入邮箱"></uni-easyinput>
        <button style="margin-top: 16px;" type="buy" :disabled="!isValidEmail" @click="save">保存</button>
	</view>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { updateUserEmail } from '@/request.api/index.js'

const store = new useStore()

const email = ref('')
const styles = {
	height: '46px',
	backgroundColor: '#f5f6f7',
}

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
const userEmail = computed(() => store.state.app.USER_INFO.email || '')
const isValidEmail = computed(() => emailRegex.test(email.value))

const setEmail = (email) => store.commit('app/setEmail', email)

const save = async () => {
	const res = await updateUserEmail(email.value)
	if (res.success) {
		setEmail(email.value)
		ElMessage.success('保存成功')
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
	margin: 0 $page-padding;
	padding-top: 16px;
}
</style>

<style>
.email-config-wrap .uni-easyinput__content {
	border-color: transparent!important;
}
.email-config-wrap .uni-easyinput__content-input {
	height: 46px;
}
</style>
