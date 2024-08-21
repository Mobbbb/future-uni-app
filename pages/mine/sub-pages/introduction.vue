<template>
	<view class="introduction">
		<uni-collapse v-model="openIndex" accordion>
			<uni-collapse-item :title="item.chName" v-for="item in futuresList">
				<template #title>
					<view class="collapse-title">{{ item.chName }}</view>
				</template>
				<view class="content">
					<view class="collapse-item">
						<view class="collapse-item-title">交易品种</view>
						<view>{{ item.chName }}</view>
					</view>
					<view class="collapse-item">
						<view class="collapse-item-title">交易代码</view>
						<view>{{ item.activeName.toUpperCase() }}</view>
					</view>
					<view class="collapse-item">
						<view class="collapse-item-title">交易单位</view>
						<view>{{ item.num }}</view>
					</view>
					<view class="collapse-item">
						<view class="collapse-item-title">开仓手续费</view>
						<view>{{ item.openCommission }}</view>
					</view>
					<view class="collapse-item">
						<view class="collapse-item-title">平仓手续费</view>
						<view>{{ item.closeCommission }}</view>
					</view>
					<view class="collapse-item">
						<view class="collapse-item-title">日内平仓手续费</view>
						<view>{{ item.dayCloseCommission }}</view>
					</view>
					<view class="collapse-item">
						<view class="collapse-item-title">是否支持优先平今</view>
						<view>{{ item.canCloseInDay ? '是' : '否' }}</view>
					</view>
				</view>
			</uni-collapse-item>
		</uni-collapse>
	</view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { updateUserInDayFirstLists } from '@/request.api/index.js'

const store = new useStore()

const futuresList = computed(() => store.getters['order/futuresList'])

const openIndex = ref('0')

</script>

<style lang="scss">
page {
	background-color: $base-background-color;
	overflow-y: scroll;
}
</style>

<style>
.introduction .uni-collapse-item__title-text {
	font-size: 16px;
}
</style>

<style scoped lang="scss">
.content {
	padding: 0 $page-padding;
}
.collapse-title {
	padding: 0 15px;
	display: flex;
	width: 100%;
	box-sizing: border-box;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	height: 48px;
	line-height: 48px;
	background-color: #fff;
	font-size: 15px;
	font-weight: bold;
	cursor: pointer;
	outline: none;
}
.collapse-item {
	display: flex;
	margin-bottom: 12px;
	color: #222;
}
.collapse-item-title {
	color: #a3a3a3;
	width: 130px;
}
</style>
