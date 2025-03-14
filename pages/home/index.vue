<!--交易 -> 下单页-->
<template>
    <page-meta :page-style="preventScrollAndPull ? 'overflow-y: hidden' : 'overflow-y: scroll'"></page-meta>
    <ux-nav :showBack="false"></ux-nav>
    <ux-pull :disabled="preventScrollAndPull" :scrollTop="scrollTop" @on-pull-end="pullLoad">
		<view class="future-wrap">
			<view class="form-wrap" ref="formWrap">
				<uni-forms 
					:modelValue="formData"
					:rules="rules" 
					label-width="95px" 
					label-position="left"
					ref="ruleFormRef">
					<uni-forms-item required label="交易日期" name="date">
						<uni-datetime-picker @on-close="onClose" @show="onShowPicker" type="datetime" :clear-icon="false" v-model="formData.date" placeholder="请选择日期" />
					</uni-forms-item>
					<uni-forms-item required label="合约" name="name">
						<uni-data-picker @popupclosed="onClose" @popupopened="onShowPicker" v-model="formData.name" :clear-icon="false" :localdata="futuresTree" popup-title="请选择合约" @change="selectOrderTree"></uni-data-picker>
					</uni-forms-item>
					<uni-forms-item required label="成交价" name="price">
						<uni-number-box v-model="formData.price" style="width: 180px;" placeholder="请输入成交价" ></uni-number-box>
					</uni-forms-item>
					<uni-forms-item required label="手数" name="hands">
						<uni-number-box v-model="formData.hands" style="width: 180px;" placeholder="请输入手数" ></uni-number-box>
					</uni-forms-item>
				</uni-forms>
				<view style="padding-bottom: 12px;">
					<button style="margin-right: 4px;" size="mini" type="buy" @click="submitHandle(1, 1)">买入</button>
					<button style="margin-right: 4px;" size="mini" type="sale" @click="submitHandle(0, 1)">卖出</button>
					<button style="margin-right: 4px;" type="info" size="mini" :disabled="!buySaleListNum.buyListNum" @click="submitHandle(0, 0)">平多</button>
					<button style="margin-right: 4px;" type="info" size="mini" :disabled="!buySaleListNum.saleListNum" @click="submitHandle(1, 0)">平空</button>
				</view>
				<view class="recently-tag-wrap" v-if="recentlyFeatureNames.length">
					<text style="margin-bottom: 8px;">最近合约：</text>
					<view class="order-name-label" v-for="item in recentlyFeatureNames" @click="selectOrderName(item)" :key="item">{{item}}</view>
				</view>
			</view>
			<ux-table class="future-table" fixed="left" :data="openingOrderList">
				<uni-table border emptyText="">
					<uni-tr>
						<uni-th prop="name" label="合约" width="70" fixed="left">合约</uni-th>
						<uni-th prop="buyOrSale" width="60" label="多/空">多/空</uni-th>
						<uni-th prop="price" minWidth="90" label="开仓均价">开仓均价</uni-th>
						<uni-th prop="hands" label="手数">手数</uni-th>
						<uni-th prop="commission" width="120" label="开仓总手续费">开仓总手续费</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in openingOrderList" :key="index" @row-click="orderRowClick(item)">
						<uni-td>{{ item.name }}</uni-td>
						<uni-td>
							<text :style="item.buyOrSale ? { color: '#eb4436' } : { color: '#0e9d58' }">
								{{item.buyOrSale ? '多' : '空'}}
							</text>
						</uni-td>
						<uni-td>{{ item.price }}</uni-td>
						<uni-td>{{ item.hands }}</uni-td>
						<uni-td>{{ item.commission }}</uni-td>
					</uni-tr>
				</uni-table>
			</ux-table>
			<view class="home-chart" :style="{ visibility: isLogin ? 'unset' : 'hidden' }" @touchmove.stop><l-echart ref="chartRef"></l-echart></view>
		</view>
    </ux-pull>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import { fetchInsertOrder, fetchRecentlyFeature } from '@/request.api'
import { getOrderLineOption } from './option'
import { dateFormat } from '@/utils/umob.js'
import { onPullDownRefresh, onPageScroll, onTabItemTap } from '@dcloudio/uni-app'

// #ifdef MP-WEIXIN
const echarts = require('../../uni_modules/lime-echart/static/echarts.min')
// #endif

// #ifndef MP-WEIXIN
import * as echarts from 'echarts'
// #endif

const futuresNum = 11
const chartRef = ref(null)
const date = new Date()
const store = new useStore()
const ruleFormRef = ref()
const formWrap = ref()
const recentlyFeatureNames = ref([])
const formData = reactive({
    date,
    name: '',
    buyOrSale: 0,
    openOrClose: 0,
    hands: 0,
    price: 0,
})

const rules = reactive({
    date: { rules: [{ required: true, errorMessage: '请选择日期', trigger: 'change' }] },
    name: { rules: [{ required: true, errorMessage: '请选择合约', trigger: 'change' }] },
    hands: { rules: [
		{ required: true,  errorMessage: '请输入手数', trigger: 'change' },
		{ validateFunction: function(rule, value, data, callback) {
			if (value <= 0) {
				callback('请输入手数')
			}
			return true
		}},
	]},
    price: { rules: [
		{ required: true,  errorMessage: '请输入成交价', trigger: 'change' },
		{ validateFunction: function(rule, value, data, callback) {
			if (value <= 0) {
				callback('请输入成交价')
			}
			return true
		}},
	]},
})

const futuresList = computed(() => store.getters['order/futuresList'])
const isLogin = computed(() => store.getters['app/isLogin'])
const openingOrderList = computed(() => store.state.order.openingOrderList)
const openingOrderGroup = computed(() => store.state.order.openingOrderGroup)
const toLoginPage = () => store.commit('app/toLoginPage')
const resetOpeningOrderData = () => store.dispatch('order/resetOpeningOrderData')
const getOpeningOrderData = () => store.dispatch('order/getOpeningOrderData')

// 合约列表
const futuresConfigList = computed(() => {
    const list = []
    const dateList = []
    let year = Number(dateFormat(date, 'yy'))
    let month = Number(dateFormat(date, 'MM'))
    
    for (let i = 0; i < futuresNum; i++) {
        month ++
        if (month > 12) {
            year ++
            month = 1
        }
        if (month < 10) {
            dateList.unshift(`${year}0${month}`)
        } else {
            dateList.unshift(`${year}${month}`)
        }
    }

    futuresList.value.forEach(item => {
        list.push([])
        dateList.forEach(cell => {
            list[list.length - 1].unshift(`${item.name}${cell}`)
        })
    })
    return list
})

// 合约列表
const futuresTree = computed(() => {
    const list = []
    const dateList = []
    let year = Number(dateFormat(date, 'yy'))
    let month = Number(dateFormat(date, 'MM'))
    
    for (let i = 0; i < futuresNum; i++) {
        month ++
        if (month > 12) {
            year ++
            month = 1
        }
        if (month < 10) {
            dateList.push(`${year}0${month}`)
        } else {
            dateList.push(`${year}${month}`)
        }
    }

    futuresList.value.forEach(item => {
		const children = []
        dateList.forEach(cell => {
            children.push({
				text: cell,
				value: `${item.name}${cell}`,
			})
        })
        list.push({
			text: item.name,
			value: item.name,
			children,
		})
    })
    return list
})

const buySaleListNum = computed(() => {
    const buyList = openingOrderList.value.filter(item => item.buyOrSale === 1 && formData.name === item.name) // 多单列表
    const saleList = openingOrderList.value.filter(item => item.buyOrSale === 0 && formData.name === item.name) // 空单列表
    return {
        buyListNum: buyList.length, // 多单列表为空
        saleListNum: saleList.length,
    }
})

/**
 * @param {*} buyOrSale 1买，0卖
 * @param {*} openOrClose 1开，0平
 */
const submitHandle = async (buyOrSale, openOrClose) => {
    if (!isLogin.value) {
        toLoginPage()
    } else {    
        const valid = await ruleFormRef.value.validate().catch(e => {})
        if (!valid) return
        
        formData.buyOrSale = buyOrSale
        formData.openOrClose = openOrClose
        formData.date = dateFormat(formData.date, 'yyyy-MM-dd hh:mm:ss')
        const data = await fetchInsertOrder(formData) || {}
        const { success } = data
        if (success) {
            ElMessage.success('操作成功')
            formData.hands = 0
            formData.price = 0
            await rerenderTable()
			renderRowPrice(openingOrderList.value[0])
        }
    }
}

const getRecentlyFeature = async () => {
    const res = await fetchRecentlyFeature()
    recentlyFeatureNames.value = res.data || []
    recentlyFeatureNames.value = recentlyFeatureNames.value.slice(0, 6)
}

const selectOrderName = (name) => {
    formData.name = name
	uni.setStorageSync('default-order-name', formData.name)
}

const selectOrderTree = (treeItem) =>{
	const { detail = [] } = treeItem
	formData.name = detail.value[1] && detail.value[1].value || ''
	uni.setStorageSync('default-order-name', formData.name)
}

const orderRowClick = (row) => {
    formData.name = row.name
    formData.hands = row.hands
	uni.setStorageSync('default-order-name', formData.name)
	renderRowPrice(row)
}

const renderRowPrice = async (row = {}) => {
	const { name, buyOrSale } = row
    const echartLists = {
        x: [],
        y: [],
    }
	if (openingOrderGroup.value[`${name}${buyOrSale}`]) {
		openingOrderGroup.value[`${name}${buyOrSale}`].forEach(item => {
		    for (let i = 0; i < item.hands; i++) {
		        echartLists.y.push(item.price)
		        echartLists.x.push(dateFormat(item.date, 'MM.dd'))
		    }
		})
	}

	const myChart = await chartRef.value.init(echarts)
	myChart.setOption(getOrderLineOption(echartLists))
}

const rerenderTable = async () => {
    await getOpeningOrderData()
}

const initOpeningAndRecentlyFeature = async () => {
	if (isLogin.value) {
		await getRecentlyFeature()
		await rerenderTable()
		renderRowPrice(openingOrderList.value[0])
	}
}

const resetData = () => {
	// 最近合约重置
	recentlyFeatureNames.value = []
	// 表格数据重置
	resetOpeningOrderData()
	// 图表数据重置
	renderRowPrice()
}

const scrollTop = ref(0)
const preventScrollAndPull = ref(false)
onPageScroll(e => scrollTop.value = e.scrollTop)
const pullLoad = async (next) => {
	await initOpeningAndRecentlyFeature()
	next()
}
const onShowPicker = () => {
	preventScrollAndPull.value = true
}
const onClose = () => {
	preventScrollAndPull.value = false
}

// #ifdef H5
let hasGotData = false
onTabItemTap(() => {
	if (!isLogin.value) {
		hasGotData = false
	} else if (!hasGotData) { // 已登录，未获取过图表
		renderRowPrice(openingOrderList.value[0])
		hasGotData = true
	}
})
// #endif

watch(isLogin, async (value) => {
    if (value) {
        initOpeningAndRecentlyFeature()
    } else {
		resetData()
    }
})

onMounted(async () => {
    await initOpeningAndRecentlyFeature()
    // 设置默认选中的合约
    const defaultOrderName = uni.getStorageSync('default-order-name')
    if (defaultOrderName) {
        formData.name = defaultOrderName
    } else {
        formData.name = futuresConfigList.value[0] && futuresConfigList.value[0][0] || ''
    }
})
</script>

<style scoped lang="scss">
.future-wrap {
    margin: 0 $page-padding;
	font-size: 14px;
}
.opening-order-table {
    font-size: 12px;
}
.drawer-input {
    background-color: #fff;
    border-radius: 4px;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    width: 180px;
    height: 37px;
    line-height: 37px;
    outline: 0;
    padding: 0 11px;
    box-shadow: 0 0 0 1px #dcdfe6 inset;
    cursor: pointer;
    transition: all .3s;
}
.drawer-input:hover {
    box-shadow: 0 0 0 1px #c0c4cc inset;
}
.drawer-input:active {
    outline: 0;
    box-shadow: 0 0 0 1px #409eff inset;
}
.order-name-label {
    background-color: white;
    border: 1px solid #dcdfe6;
    padding: 2px 8px;
    font-weight: normal;
    color: #606266;
    margin: 0 8px 8px 0;
    transition: all .3s;
    width: 82px;
    text-align: center;
    box-sizing: border-box;
	border-radius: 4px;
}
.order-name-label:active {
    border: 1px solid #409eff;
}
.recently-tag-wrap {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
}
.recently-tag-wrap {
    padding: 0 0 4px 0;
}
.line-chart {
    width: 340px;
    height: 300px;
}
.price-cell {
    cursor: pointer;
}
.home-chart {
	height: 250px;
	width: 100%;
	padding: 24px 0 8px 0;
}
</style>
