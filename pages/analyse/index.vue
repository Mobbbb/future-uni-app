<!--交易 -> 账户分析-->
<template>
	<ux-nav :showBack="false" :background="topBg.header">账户分析</ux-nav>
    <view class="future-wrap">
        <view class="analyse-content-wrap">
            <view :style="topBg.bottom">
                <view class="total-analyse-wrap">
                    <view class="total-analyse-title">盈亏</view>
                    <view class="total-analyse-value" 
                        :style="analyseResult.totalProfit >= 0 ?
                        { color: 'rgb(235, 68, 54)' } :
                        { color: 'rgb(14, 157, 88)' }">
                        {{analyseResult.totalProfit.toLocaleString()}}
                    </view>
                </view>
                <uni-card>
					<view class="search-input-wrap">
						<uni-datetime-picker type="daterange" v-model="basicDate" :clear-icon="false" @change="changeBasicDate" placeholder="请选择日期" />
					</view>
                    <view class="card-title">交易统计<span class="card-title-date">({{displayTime}})</span></view>
                    <view class="card-row-wrap">
                        <view class="card-item-wrap">
                            <view class="card-item-title">多单胜率</view>
                            <view class="card-item-value">{{analyseResult.buyRate}}%</view>
                        </view>
                        <view class="card-item-wrap">
                            <view class="card-item-title">空单胜率</view>
                            <view class="card-item-value">{{analyseResult.saleRate}}%</view>
                        </view>
                        <view class="card-item-wrap">
                            <view class="card-item-title">总胜率</view>
                            <view class="card-item-value">{{analyseResult.totalRate}}%</view>
                        </view>
                    </view>
                </uni-card>
            </view>
            <uni-card>
                <view class="card-title">品种盈亏及胜率<span class="card-title-date">({{displayTime}})</span></view>
				<view id="barChart">
					<l-echart ref="barChart"></l-echart>
					<view class="bar-custom-tooltips">
						{{ barParams[0] && barParams[0].data[0] || '' }}
						<view style="width: 11px;margin: 0 4px 0 12px;">
							<view style="width: 100%;height: 3px;border-radius: 3px;margin-bottom: 2px;" :style="{ background: fillColor[0] }"></view>
							<view style="width: 100%;height: 3px;border-radius: 3px;margin-top: 2px;" :style="{ background: fillColor[1] }"></view>
						</view>
						{{ barParams[0] && barParams[0].dimensionNames[1] || '' }}
						<text style="font-weight: bold;margin-left: 4px;" :style="{ color: barParams[0] && barParams[0].data[1] > 0 ? fillColor[0] : fillColor[1] }">
							{{ Math.round(barParams[0] && barParams[0].data[1]) }}
						</text>
						<view style="width: 6px;height: 6px;border-radius: 10px;margin: 0 4px 0 12px;" :style="{ background: fillColor[2] }"></view>
						{{ barParams[0] && barParams[0].dimensionNames[2] }}
						<text style="font-weight: bold;margin-left: 4px;" :style="{ color: barParams[0] && barParams[0].data[1] > 0 ? fillColor[0] : fillColor[1] }">
							{{ barParams[0] && barParams[0].data[2].toFixed(2) }}%
						</text>    
					</view>
				</view>
            </uni-card>
            <uni-card>
                <view class="card-title">多单统计<span class="card-title-date">({{displayTime}})</span></view>
                <view class="card-column-wrap">
                    <view class="card-item-wrap">
                        <view class="card-item-title">总盈利</view>
                        <view class="card-item-combine-value">
                            <view class="card-item-value" style="color: rgb(235, 68, 54);">
                                {{analyseResult.buyProfitUp[0]}}
                                <span class="card-item-unit">{{analyseResult.buyProfitUp[1]}}元</span>
                            </view>
                        </view>
                    </view>
                    <view class="card-item-wrap">
                        <view class="card-item-title">每手盈利</view>
                        <view class="card-item-combine-value">
                            <view class="card-item-value" style="color: rgb(235, 68, 54);">
                                {{analyseResult.preBuyProfitUp}}
                                <span class="card-item-unit">元/手</span>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="card-column-wrap">
                    <view class="card-item-wrap">
                        <view class="card-item-title">总亏损</view>
                        <view class="card-item-combine-value">
                            <view class="card-item-value" style="color: rgb(14, 157, 88);">
                                {{analyseResult.buyProfitDown[0]}}
                                <span class="card-item-unit">{{analyseResult.buyProfitDown[1]}}元</span>
                            </view>
                        </view>
                    </view>
                    <view class="card-item-wrap">
                        <view class="card-item-title">每手亏损</view>
                        <view class="card-item-combine-value">
                            <view class="card-item-value" style="color: rgb(14, 157, 88);">
                                {{analyseResult.preBuyProfitDown}}
                                <span class="card-item-unit">元/手</span>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="card-column-wrap">
                    <view class="card-item-wrap">
                        <view class="card-item-title">净盈亏</view>
                        <view class="card-item-combine-value">
                            <view class="card-item-value" 
                                :style="analyseResult.buyProfit[0] >= 0 ?
                                { color: 'rgb(235, 68, 54)' } :
                                { color: 'rgb(14, 157, 88)' }">
                                {{analyseResult.buyProfit[0]}}
                                <span class="card-item-unit">{{analyseResult.buyProfit[1]}}元</span>
                            </view>
                        </view>
                    </view>
                    <view class="card-item-wrap">
                        <view class="card-item-title">每手净盈亏</view>
                        <view class="card-item-value"
                            :style="analyseResult.preBuyProfit >= 0 ?
                            { color: 'rgb(235, 68, 54)' } :
                            { color: 'rgb(14, 157, 88)' }">
                            {{analyseResult.preBuyProfit}}
                            <span class="card-item-unit">元/手</span>
                        </view>
                    </view>
                </view>
            </uni-card>
            <uni-card>
                <view class="card-title">空单统计<span class="card-title-date">({{displayTime}})</span></view>
                <view class="card-column-wrap">
                    <view class="card-item-wrap">
                        <view class="card-item-title">总盈利</view>
                        <view class="card-item-combine-value">
                            <view class="card-item-value" style="color: rgb(235, 68, 54);">
                                {{analyseResult.saleProfitUp[0]}}
                                <span class="card-item-unit">{{analyseResult.saleProfitUp[1]}}元</span>
                            </view>
                        </view>
                    </view>
                    <view class="card-item-wrap">
                        <view class="card-item-title">每手盈利</view>
                        <view class="card-item-combine-value">
                            <view class="card-item-value" style="color: rgb(235, 68, 54);">
                                {{analyseResult.preSaleProfitUp}}
                                <span class="card-item-unit">元/手</span>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="card-column-wrap">
                    <view class="card-item-wrap">
                        <view class="card-item-title">总亏损</view>
                        <view class="card-item-combine-value">
                            <view class="card-item-value" style="color: rgb(14, 157, 88);">
                                {{analyseResult.saleProfitDown[0]}}
                                <span class="card-item-unit">{{analyseResult.saleProfitDown[1]}}元</span>
                            </view>
                        </view>
                    </view>
                    <view class="card-item-wrap">
                        <view class="card-item-title">每手亏损</view>
                        <view class="card-item-combine-value">
                            <view class="card-item-value" style="color: rgb(14, 157, 88);">
                                {{analyseResult.preSaleProfitDown}}
                                <span class="card-item-unit">元/手</span>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="card-column-wrap">
                    <view class="card-item-wrap">
                        <view class="card-item-title">净盈亏</view>
                        <view class="card-item-combine-value">
                            <view class="card-item-value" 
                                :style="analyseResult.saleProfit[0] >= 0 ?
                                { color: 'rgb(235, 68, 54)' } :
                                { color: 'rgb(14, 157, 88)' }">
                                {{analyseResult.saleProfit[0]}}
                                <span class="card-item-unit">{{analyseResult.saleProfit[1]}}元</span>
                            </view>
                        </view>
                    </view>
                    <view class="card-item-wrap">
                        <view class="card-item-title">每手净盈亏</view>
                        <view class="card-item-value"
                            :style="analyseResult.preSaleProfit >= 0 ?
                            { color: 'rgb(235, 68, 54)' } :
                            { color: 'rgb(14, 157, 88)' }">
                            {{analyseResult.preSaleProfit}}
                            <span class="card-item-unit">元/手</span>
                        </view>
                    </view>
                </view>
            </uni-card>
            <uni-card>
                <view class="analyse-calendar-header">
                    <view class="date-picker-wrap" v-if="dayCalendarShowStatus">
						<ux-icon right="6" type="left" size="16" @click="changeCalendarDate(-1)"></ux-icon>
						<ux-month-picker v-model="calendarDate" :clearIcon="false" @change="changeCalendarDate('')" placeholder="请选择日期"></ux-month-picker>
						<ux-icon left="6" type="right" size="16" @click="changeCalendarDate(1)"></ux-icon>
                    </view>
                    <view class="date-picker-wrap" v-else>
						<ux-icon right="6" type="left" size="16" @click="changeCalendarYear(-1)"></ux-icon>
						<ux-year-picker v-model="calendarYear" :clearIcon="false" @change="changeCalendarYear" placeholder="请选择日期"></ux-year-picker>
						<ux-icon left="6" type="right" size="16" @click="changeCalendarYear(1)"></ux-icon>
                    </view>
                    <ux-switch
						size="small"
                        @change="changeCalendarDim"
                        v-model="dayCalendarShowStatus"
						active-color="#13ce66"
                        active-text="月"
                        inactive-text="年"
						class="ml-12" />
                </view>
				<ux-calendar v-if="dayCalendarShowStatus" :selected="selectedDate" :showActive="false" :date="calendarInnerDate" :showMonth="false" @change="selectCalendar" />
                <monthly-calendar class="analyse-monthly-calendar" v-else :year="calendarYear" @on-click="drillingMonthCalendar">
                    <template #dateCell="{ data }">
                        <view class="date-cell month-date-cell" :class="getCalendarCellClass(data)">
                            <view class="date-cell-top">{{ data.label }}</view>
                            <view class="date-cell-bottom">{{ formatCalendarCellData(data) }}</view>
                        </view>
                    </template>
                </monthly-calendar>
            </uni-card>
            <uni-card>
                <view class="line-chart-filter-wrap">
					<uni-data-select class="data-select mr-12" :clear="false" v-model="dayLineFutureNameBindValue" :localdata="futuresList"  @change="changeDayLineFuture"></uni-data-select>
					<ux-month-picker v-model="kLineDate" :clearIcon="false" @change="changeKLineDate" placeholder="请选择日期"></ux-month-picker>
                </view>
				<view id="lineChart"><l-echart ref="lineChart"></l-echart></view>
            </uni-card>
        </view>
    </view>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useStore } from 'vuex'
import { parseDateParams, getGapDate, getMonthShortcuts } from '@/utils'
import festivalMap, { festivalList } from '@/config/festivalMap'
import { getBarOption, getDoubleKLineOption, fillColor } from './option'
import MonthlyCalendar from '@/components/monthly-calendar.vue'
import { dateFormat, calculateDate, toMonth, dateGap } from '@/utils/umob.js'
import { formatPriceLineData, formatBasicData, formatCalendarData } from '@/utils/data-processing.js'
import { fetchOrderInfoHandle } from '@/request.api/index.js'

// #ifdef MP-WEIXIN
const echarts = require('../../uni_modules/lime-echart/static/echarts.min')
// #endif

// #ifndef MP-WEIXIN
import * as echarts from 'echarts'
// #endif

const store = new useStore()

const K_LINE_DATE_KEY_NAME = computed(() => `K-LINE-DATE-${store.state.app.USER_INFO.userId}`)

let barChartIns = null
let lineChartIns = null
const lineChart = ref()
const barChart = ref()
const barParams = ref([])
const monthShortcuts = getMonthShortcuts(4)
const shortcuts = [
    { text: '今日', value: () => getGapDate() },
    { text: '近7天', value: () => getGapDate(7) },
    { text: '近30天', value: () => getGapDate(30) },
    { text: '近365天', value: () => getGapDate(365) },
    ...monthShortcuts,
    { text: '全部', value: () => getGapDate(365 * ((new Date()).getFullYear() - 2018)) },
]
const analyseResult = reactive({
    buyRate: 0,
    saleRate: 0,
    totalRate: 0,
    totalProfit: 0,
    buyProfit: [],
    buyProfitUp: [],
    buyProfitDown: [],
    saleProfit: [],
    saleProfitUp: [],
    saleProfitDown: [],
    preBuyProfit: 0,
    preBuyProfitUp: 0,
    preBuyProfitDown: 0,
    preSaleProfit: 0,
    preSaleProfitUp: 0,
    preSaleProfitDown: 0,
})
const calendarDate = ref(dateFormat(new Date(), 'yyyy-MM'))
const calendarYear = ref(new Date().getFullYear().toString())
const basicDate = ref(monthShortcuts[0].value)
const kLineDate = uni.getStorageSync(K_LINE_DATE_KEY_NAME.value) 
    ? ref(uni.getStorageSync(K_LINE_DATE_KEY_NAME.value))
    : ref(calculateDate(dateFormat(new Date(), 'yyyy-MM'), 1))

const calendarLoadingStatus = ref(false)
const dayCalendarShowStatus = ref(true)
const barChartMaxWidth = ref(0)
const dayLineFutureName = ref('')
const closeFutureLists = ref([])
const calendarDataMap = ref({})
const selectedDate = ref([])

const activeOrderTab = computed(() => store.state.app.activeOrderTab)
const enFutureNameMap = computed(() => store.getters['order/enFutureNameMap'])
const enFutureMap = computed(() => store.getters['order/enFutureMap'])
const isLogin = computed(() => store.getters['app/isLogin'])
const futuresList = computed(() => store.getters['order/futuresList'])
const displayTime = computed(() => dateFormat(basicDate.value[0]) + ' To ' + dateFormat(basicDate.value[1]))
const calendarInnerDate = computed(() => dateFormat(new Date(calendarDate.value)))
const dayLineFutureNameBindValue = computed({
    get() {
        const firstFuturesItem = futuresList.value[0] || {}
        if (!dayLineFutureName.value) {
            dayLineFutureName.value = firstFuturesItem.name || ''
        }
        return dayLineFutureName.value
    },
    set(value) {
        dayLineFutureName.value = value
    },
})

const topBg = computed(() => {
	return analyseResult.totalProfit >= 0 ?
	    {
			header: 'linear-gradient(#fff, #fef8fa 100%)',
			bottom: { background: 'linear-gradient(#fef8fa, rgba(243, 63, 109, 0.1) 120px, #fff 120px, #fff 100%)' },
		} :
	    {
			header: 'linear-gradient(#fff, #f8fdf9 100%)',
			bottom: { background: 'linear-gradient(#f8fdf9, rgba(17, 166, 66, 0.1) 120px, #fff 120px, #fff 100%)' },
		}
})

const getCloseFutureByDate = async (dateParams) => { // 所有平仓订单
    const response = await fetchOrderInfoHandle({
        ...dateParams,
        openOrClose: 0,
    })
    return response.result
}

const getFutureByName = async () => { // 指定品种的全部订单
    if (!isLogin.value) return []
    const formatDayLineDate = toMonth(kLineDate.value)
    const res = await fetchOrderInfoHandle({
        name: `${dayLineFutureName.value}${formatDayLineDate.slice(2, 4)}${formatDayLineDate.slice(5, 7)}`,
        orderBy: 'ASC',
    })
    return res.result || []
}

function addZero(num) {
	if (num < 10) {
		num = `0${num}`
	}
	return num
}

const selectCalendar = async (data) => {
	calendarDate.value = `${data.lunar.cYear}-${addZero(data.lunar.cMonth)}`
	
	initDayCalendar()
}

const initCalendar = async (date) => {
    if (!isLogin.value) return
    let dateRange = []
    if (dayCalendarShowStatus.value) {
        const dateParam = date && dateFormat(date) || calendarDate.value
        const day = new Date(dateParam.slice(0, 4), dateParam.slice(5, 7), 0).getDate()
        dateRange = [dateParam.slice(0, 7) + '-01', `${dateParam.slice(0, 7)}-${day}`]
    } else {
        const year = date || new Date(calendarYear.value).getFullYear()
        dateRange = [`${year}-01-01`, `${year}-12-31`]
    }

    const yearMothKey = `${dateRange[1].slice(0, 7)}-status`
    const yearKey = `${dateRange[1].slice(0, 4)}-status`
    if (calendarDataMap.value[yearMothKey] && dayCalendarShowStatus.value) return // 如果该月份数据已获取，不再重新请求
    if (calendarDataMap.value[yearKey] && !dayCalendarShowStatus.value) return // 如果该年份数据已获取，不再重新请求

    calendarLoadingStatus.value = true
    const params = parseDateParams(dateRange)
    const result = await getCloseFutureByDate(params)
    calendarLoadingStatus.value = false

    formatCalendarData(result, {
        calendarDataMap: calendarDataMap.value,
        dayCalendarShowStatus: dayCalendarShowStatus.value,
        yearMothKey,
        yearKey,
    })
}

const initDayLineChart = async () => {
    const designatedFutureLists = await getFutureByName()

    nextTick(async () => {
        const params = formatPriceLineData(designatedFutureLists)
        const option = getDoubleKLineOption(params, enFutureMap.value[dayLineFutureName.value])

        lineChartIns = await lineChart.value.init(echarts)
        lineChartIns.setOption(option)
    })
}

const initBasicInfo = async () => {
    if (!isLogin.value) return
    const requestParams = parseDateParams(basicDate.value)
    closeFutureLists.value = await getCloseFutureByDate(requestParams)

    const params = formatBasicData(enFutureNameMap.value, closeFutureLists.value)

    barChartMaxWidth.value = Object.keys(params.chFutureMap).length * 60 < 500 ?  500 : Object.keys(params.chFutureMap).length * 60

    nextTick(async () => {
        barChartIns = await barChart.value.init(echarts)
        barChartIns.setOption(getBarOption(params.chFutureMap, barParams))
        barChartIns.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: 0,
        })
    })
    analyseResult.buyRate = params.buyRate
    analyseResult.saleRate = params.saleRate
    analyseResult.totalRate = params.totalRate
    analyseResult.preBuyProfit = params.preBuyProfit
    analyseResult.preBuyProfitUp = params.preBuyProfitUp
    analyseResult.preBuyProfitDown = params.preBuyProfitDown
    analyseResult.preSaleProfit = params.preSaleProfit
    analyseResult.preSaleProfitUp = params.preSaleProfitUp
    analyseResult.preSaleProfitDown = params.preSaleProfitDown

    analyseResult.saleProfit = params.saleProfit
    analyseResult.saleProfitUp = params.saleProfitUp
    analyseResult.saleProfitDown = params.saleProfitDown
    analyseResult.buyProfit = params.buyProfit
    analyseResult.buyProfitUp = params.buyProfitUp
    analyseResult.buyProfitDown = params.buyProfitDown
    analyseResult.totalProfit = params.totalProfit
}

const changeBasicDate = () => {
    initBasicInfo()
}

const changeKLineDate = () => {
    uni.setStorageSync(K_LINE_DATE_KEY_NAME.value, toMonth(kLineDate.value))
    initDayLineChart()
}

const changeDayLineFuture = () => {
    initDayLineChart()
}

const changeCalendarDate = async (num) => {
    if (num) {
        calendarDate.value = calculateDate(calendarDate.value, num)
    }

	initDayCalendar()
}

const changeCalendarYear = (value) => {
    if (typeof value === 'number') {
        const year = new Date(calendarYear.value).getFullYear()
        calendarYear.value = (year + value).toString()
    }
    initCalendar()
}

const getCalendarCellClass = (data) => {
    let itemData = calendarDataMap.value[data.day.slice(0, 7)]

    if (calendarLoadingStatus.value) return ''

    let className = ''
    if (itemData) {
        if (itemData > 0) {
            className = 'red-calendar-cell'
        } else {
            className = 'green-calendar-cell'
        }
    } else if (dayCalendarShowStatus.value) {
        className = 'normal-calendar-cell'
    } else {
        className = 'no-data-month-cell'
    }
    return className
}

const getSelectedCalendarData = () => {
	selectedDate.value = []
	
	const dateArr = dateGap(new Date(`${calendarDate.value}-01`), new Date(calendarDate.value.slice(0, 4), calendarDate.value.slice(5, 7), 0))

	dateArr.forEach(date => {
		const cellDay = (new Date(date)).getDay()
		
		if (festivalList.includes(date) || festivalMap[date] || festivalMap[date.slice(5, 10)]) {
			selectedDate.value.push({ date: date, info: festivalMap[date] || festivalMap[date.slice(5, 10)] || '休', color: '#a8ade3' })
		} else if (cellDay !== 0 && cellDay !== 6) { // 非周末
			if (typeof calendarDataMap.value[date] !== 'undefined') {
				if (calendarDataMap.value[date]) {
					selectedDate.value.push({
						date: date,
						info: Math.round(calendarDataMap.value[date]),
						color: calendarDataMap.value[date] > 0 ? '#eb4436' : '#0e9d58',
						background: calendarDataMap.value[date] > 0 ? '#fae6e7' : '#e8f3eb',
					})
				} else {
					selectedDate.value.push({
						date: date,
						info: '0',
						color: '#303133',
					})
				}
			} else {
				selectedDate.value.push({ date: date, info: '--', color: '#303133' })
			}
		}
	})
}

const formatCalendarCellData = (data) => {
    if (calendarLoadingStatus.value) return ''

    let itemData = calendarDataMap.value[data.day.slice(0, 7)]

    if (typeof itemData !== 'undefined') {
        return Math.round(itemData)
    } else {
        return '--'
    }
}

const changeCalendarDim = () => {
    if (!dayCalendarShowStatus.value) { // 切换为年，立即请求数据
        initCalendar()
    }
}

const drillingMonthCalendar = (value) => {
    dayCalendarShowStatus.value = true
    calendarDate.value = value.day
    initCalendar()
}

const initAnalyseData = () => {
    initBasicInfo()
    initDayCalendar()
    initDayLineChart()
}

const getDataWhileActive = () => {
    if (isLogin.value) {
        initAnalyseData()
    }
}

const initDayCalendar  = async () => {
	await initCalendar()
	getSelectedCalendarData()
}

watch(isLogin, (value) => {
    if (value) {
        getDataWhileActive()
    } else {
        closeFutureLists.value = [] // 清空数据
        calendarDataMap.value = {} // 清空数据
        initAnalyseData()
    }
})

onMounted(() => {
    getDataWhileActive()
})
</script>

<style scoped>
.search-input-wrap {
    color: #606266;
    font-size: 12px;
    box-sizing: border-box;
    height: 42px;
	margin-bottom: 12px;
}
.analyse-calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 500px;
}
.search-item-wrap span {
    flex-shrink: 0;
}
.total-analyse-wrap {
    text-align: center;
    padding: 16px 0 4px 0;
}
.total-analyse-title {
    font-size: 13px;
    margin-bottom: 8px;
}
.total-analyse-value {
    font-size: 24px;
    font-weight: bold;
}
.card-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 12px;
}
.card-row-wrap {
    display: flex;
}
.card-column-wrap {
    display: flex;
    flex-direction: column;
    float: left;
}
.card-item-wrap {
    margin-right: 24px;
    margin-bottom: 12px;
}
.card-column-wrap:last-child .card-item-wrap {
    margin-right: 0;
}
.card-item-title {
    font-size: 12px;
    margin-bottom: 4px;
    color: var(--el-text-color-regular);
}
.card-item-value {
    font-size: 16px;
    font-weight: bold;
}
.card-item-combine-value {
    display: flex;
}
.card-item-unit {
    font-size: 12px;
}
.date-picker-wrap {
    width: 100%;
    display: flex;
    align-items: center;
}
.month-cell-wrap {
	
}
.date-cell {
    height: 100%;
    font-size: 12px;
}
.date-cell .date-cell-top {
    padding: 8px;
    font-size: 16px;
}
.red-calendar-cell .date-cell-top, .green-calendar-cell .date-cell-top {
    color: #222;
}
.red-calendar-cell {
    background: #fae6e7;
    color: rgb(235, 68, 54);
    font-weight: bold;
}
.green-calendar-cell {
    background: #e8f3eb;
    color: rgb(14, 157, 88);
    font-weight: bold;
}
.month-date-cell .date-cell-top {
    font-weight: normal;
}
.weekend-day-cell {
    color: #a8ade3;
}
.festival-day-cell .date-cell-top {
    font-weight: bold;
}
.festival-day-cell .date-cell-bottom {
    color: #a8ade3;
}
.normal-calendar-cell .date-cell-top {
    font-weight: bold;
}
.no-data-month-cell {
    color: #c0c4cc;
}
.card-title-date {
    font-weight: normal;
    font-size: 12px;
    margin-left: 4px;
}
.analyse-calendar {
    max-width: 500px;
}
.analyse-monthly-calendar {
    max-width: 512px;
}
#barChart {
    height: 37.5vh;
    width: 100%;
    background: white;
	position: relative;
}
.bar-custom-tooltips {
	position: absolute;
	top: 0;
	left: 0;
	border: 1px solid #eeeeee;
	padding: 12px;
	border-radius: 4px;
	color: #000;
	display: flex;
	align-items: center;
	font-size: 14px;
	line-height: 14px;
}
#lineChart {
    height: 460px;
    width: 100%;
    max-width: 100%;
    background: white;
}
.line-chart-filter-wrap {
    display: flex;
}
.analyse-select {
    width: 120px;
    margin-right: 12px;
}
.data-select {
	width: 100%;
}
</style>
