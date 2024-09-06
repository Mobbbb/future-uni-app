<template>
	<ux-nav>品种简介</ux-nav>
	<view class="introduction">
		<uni-collapse v-model="openIndex" accordion v-if="futuresList.length">
			<uni-collapse-item v-for="item in futuresList" :key="item.name">
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
						<view>{{ item.name.toUpperCase() }}</view>
					</view>
					<view class="collapse-item">
						<view class="collapse-item-title">每手每报价单位价格</view>
						<view>{{ item.num }} 元/手/报价单位</view>
					</view>
					<view class="collapse-item">
						<view class="collapse-item-title">开仓手续费</view>
						<view>{{ item.openCommissionType === 'number' ? item.openCommission * commissionType + '元/手' : item.openCommission * commissionType * 100 + '%' }}</view>
					</view>
					<view class="collapse-item">
						<view class="collapse-item-title">平仓手续费</view>
						<view>{{ item.closeCommissionType === 'number' ? item.closeCommission * commissionType + '元/手' : item.closeCommission * commissionType * 100 + '%' }}</view>
					</view>
					<view class="collapse-item">
						<view class="collapse-item-title">日内平仓手续费</view>
						<view>{{ item.closeCommissionType === 'number' ? item.dayCloseCommission * commissionType + '元/手' : item.dayCloseCommission * commissionType * 100 + '%' }}</view>
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
const commissionType = computed(() => store.state.app.USER_INFO.commissionType || 4)

const openIndex = ref('0')

</script>

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
