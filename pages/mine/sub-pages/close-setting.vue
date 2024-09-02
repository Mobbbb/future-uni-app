<template>
	<ux-nav>优先平今</ux-nav>
	<view class="config-wrap">
		<view class="config-list">
			<view class="config-list-cell" v-for="item in closeSettingfuturesList" :key="item.id">
				<view class="config-list-cell-text">{{item.chName}}</view>
				<switch color="#13ce66" :checked="initCheckList.includes(item.name)" @change="switchChange($event, item)" />
			</view>
		</view>
	</view>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { updateUserInDayFirstLists } from '@/request.api/index.js'

const store = new useStore()

const isLogin = computed(() => store.getters['app/isLogin'])
const USER_INFO = computed(() => store.state.app.USER_INFO)
const closeSettingfuturesList = computed(() => store.getters['order/closeSettingfuturesList'])
const initCheckList = computed(() => USER_INFO.value.inDayFirstLists || [])

const setInDayFirstLists = (status) => store.commit('app/setInDayFirstLists', status)
const logoutAction = () => store.dispatch('app/logoutAction')

const switchChange = async (e, item) => {
	if (!isLogin.value) {
		ElMessage.error('请先登录')
		logoutAction()
		return
	}
	const checkList = [...initCheckList.value]
	const index = checkList.indexOf(item.name)
	if (index > -1) {
		checkList.splice(index, 1)
	} else {
		checkList.push(item.name)
	}

	const res = await updateUserInDayFirstLists(checkList.join(','))
	if (res.success) {
		ElMessage.success('修改成功')
		setInDayFirstLists(checkList)
	}
}

</script>

<style scoped lang="scss">
.config-list {
	background-color: #fff;
}
.config-list-cell {
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 11px $page-padding;
}
.config-list-cell-text {
	flex: 1;
}
.config-list-cell::after {
    position: absolute;
    z-index: 3;
    right: 0;
    bottom: 0;
    left: $page-padding;
    height: 1px;
    content: "";
    transform: scaleY(.5);
    background-color: #c8c7cc;
}
</style>
