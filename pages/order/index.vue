<!--交易 -> 交易记录-->
<template>
    <view class="future-wrap order-wrap" ref="tableTabWrap">
        <view class="search-wrap">
            <view class="search-item-wrap">
                <text>起止日期：</text>
				<uni-icons type="left" color="#dcdfe6" size="26" @click="selectDate(-1)"></uni-icons>
				<uni-datetime-picker type="daterange" v-model="searchParams.date" @change="selectDate" placeholder="请选择日期" />
				<uni-icons type="right" color="#dcdfe6" size="26" @click="selectDate(1)"></uni-icons>
            </view>
            <view class="search-item-wrap">
                <text>合约名：</text>
				<uni-easyinput v-model="searchParams.name" placeholder="请输入合约名"></uni-easyinput>
                <button class="ml-12 mr-12" type="primary" size="mini" @click="searchHandle">搜索</button>
                <button size="mini" @click="resetHandle">重置</button>
            </view>
        </view>
		<ux-table class="future-table" fixed="right left" :data="orderList" :loading="loading">
			<uni-table emptyText="">
				<uni-tr>
					<uni-th prop="name" label="合约" width="66">合约</uni-th>
					<uni-th prop="buyOrSale" width="70" label="买/卖">买/卖</uni-th>
					<uni-th prop="price" width="100" label="成交价">成交价</uni-th>
					<uni-th prop="hands" width="60" label="手数">手数</uni-th>
					<uni-th prop="commission" width="90" label="手续费">手续费</uni-th>
					<uni-th prop="openOrClose" width="70" label="开/平">开/平</uni-th>
					<uni-th prop="openOrClose" width="150" label="交易时间">交易时间</uni-th>
					<uni-th prop="openOrClose" width="90" label="成交序号">成交序号</uni-th>
					<uni-th prop="openOrClose" width="120" label="关联序号">关联序号</uni-th>
					<uni-th prop="openOrClose" width="60" label="状态">状态</uni-th>
					<uni-th prop="openOrClose" align="right" width="160" label="操作">操作</uni-th>
					<uni-th prop="openOrClose" align="center" width="100" label="平仓盈亏">平仓盈亏</uni-th>
					<uni-th prop="openOrClose" align="center" width="90" label="净盈亏">净盈亏</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in orderList" :key="item.id" @row-click="orderRowClick(item)">
					<uni-td>{{ item.name }}</uni-td>
					<uni-td>
						<text :style="item.buyOrSale ? { color: '#eb4436' } : { color: '#0e9d58' }">
							{{item.buyOrSale ? '买' : '卖'}}
						</text>
					</uni-td>
					<uni-td>{{ item.price }}</uni-td>
					<uni-td>{{ item.hands }}</uni-td>
					<uni-td>{{ item.commission }}</uni-td>
					<uni-td>
						<text>
							{{item.openOrClose ? '开' : '平'}}
						</text>
					</uni-td>
					<uni-td>{{ item.date }}</uni-td>
					<uni-td>{{ item.id }}</uni-td>
					<uni-td>{{ item.linkId }}</uni-td>
					<uni-td>
						<text v-if="(item.closeHands === null)">--</text>
						<text v-else-if="item.closeHands === 0">未平</text>
						<text v-else-if="item.closeHands === item.hands">已平</text>
						<text v-else>已平{{item.closeHands}}手</text>
					</uni-td>
					<uni-td>
						<view class="alignRight">
							<button class="mr-12" size="mini" type="warning" v-if="!item.openOrClose" @click="cancelRow(scope)">
								撤销
							</button>
							<button size="mini" type="buy" @click="deleteRow(scope)">
								删除
							</button>
						</view>
					</uni-td>
					<uni-td>
						<view class="alignCenter" v-if="(item.profit || item.profit === 0)"
						    :style="item.profit > 0 ? { color: '#eb4436' } : { color: '#0e9d58' }">
						    <text style="font-weight: bold;">{{item.profit}}</text>
						</view>
						<view v-else class="talbe-block-cell alignCenter">--</view>
					</uni-td>
					<uni-td>
						<view class="alignCenter" v-if="(item.totalProfit || item.totalProfit === 0)"
						    :style="item.totalProfit > 0 ? { color: '#eb4436' } : { color: '#0e9d58' }">
						    <text style="font-weight: bold;">{{item.totalProfit}}</text>
						</view>
						<view v-else class="talbe-block-cell alignCenter">--</view>
					</uni-td>
				</uni-tr>
			</uni-table>
		</ux-table>
        <view class="pagination-wrap">
			<uni-pagination @change="onPageChange" :total="orderCountNum.total" :current="searchParams.currentPage" :pageSize="searchParams.pageSize" />
        </view>
		<uni-popup ref="popup" type="center" :mask-click="false" :animation="false">
			<text>确定要删除吗？</text>
			<template #footer>
			    <text class="dialog-footer">
			        <button type="danger" @click="confirmDelete">确定</button>
			        <button @click="centerDialogVisible = false">取消</button>
			    </text>
			</template>
		</uni-popup>
    </view>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, onMounted } from 'vue'
import { useStore } from 'vuex'
import { fetchDeleteOrder, fetchCancelOrder, fetchInsertIncome, fetchIncomeLatestInfo, 
    fetchfutureLatestInfo, fetchOrderInfoHandle, fetchOrderInfoByUserIdHandle } from '@/request.api/index.js'
import { parseDateParams, getGapDate, getMonthShortcuts, getDateByStep, getBelongDealDate } from '@/utils'
import { dateFormat } from '@/utils/umob.js'

const _rate_ = 11 / 26
const monthShortcuts = getMonthShortcuts(5)
const store = new useStore()
const searchInputWrap = ref()
const tableTabWrap = ref()
const orderTableHeight = ref(0)
const loading = ref(false)
const centerDialogVisible = ref(false)
const importDialogVisible = ref(false)
const maxColunmWidth = ref(80)
const orderCountNum = ref({ total: 0 })
const submitData = reactive({
    date: new Date(),
    num: 0,
    subNum: 0,
    name: '',
    remark: '',
})
const searchParams = reactive({
    date: [new Date(), new Date()],
    name: '',
    openOrClose: '',
    buyOrSale: '',
    startDate: '',
    endDate: '',
    status: 0,
    pageSize: 14,
    currentPage: 1,
})

const shortcuts = [
    { text: '今日', value: () => [new Date(), new Date()] },
    { text: '近7天', value: () => getGapDate(7) },
    { text: '近30天', value: () => getGapDate(30) },
    { text: '近365天', value: () => getGapDate(365) },
    ...monthShortcuts,
]

const orderList = computed(() => store.state.order.orderList)
const activeOrderTab = computed(() => store.state.app.activeOrderTab)
const isLogin = computed(() => store.getters['app/isLogin'])
const isAdministrator = computed(() => store.getters['app/isAdministrator'])
const overMediaCritical = computed(() => store.getters['app/overMediaCritical'])

const accountName = computed(() => {
    const { account = '' } = store.state.app.USER_INFO
    if (account) return account.split(',')
    return []
})

const getOrderData = (params) => store.dispatch('order/getOrderData', params)
const setOrderList = (value) => store.commit('order/setOrderList', value)

const tableRowClassName = ({ row }) => {
    if (!row.openOrClose) {
        return 'negative-row'
    } else if (row.closeHands === row.hands) { // 已被全平
        return 'disable-row'
    }
}

const onPageChange = (value) => {
    searchParams.currentPage = value.current
    getTableData()
}

const getTableData = async () => {
    if (!isLogin.value) return
    const params = parseDateParams(searchParams.date)
    searchParams.startDate = params.startDate
    searchParams.endDate = params.endDate
    loading.value = true
    orderCountNum.value = await getOrderData(searchParams)
    let strLength = 0
    orderList.value.forEach(item => {
        if (item.linkId.length > strLength && item.linkId) {
            strLength = item.linkId.length
        }
    })
    if (strLength) maxColunmWidth.value = strLength * 9 < 80 ? 80 : strLength * 9
    loading.value = false
    submitData.num = orderCountNum.value.totalProfit || 0
}

let currentDeleteItem = null
const deleteRow = async (data) => {
    currentDeleteItem = data
    centerDialogVisible.value = true
}

const cancelRow = async (data) => {
    loading.value = true
    await fetchCancelOrder(data.row) // 回退开仓单
    getTableData()
}

const confirmDelete = async () => {
    if (currentDeleteItem) {
        loading.value = true
        await fetchDeleteOrder(currentDeleteItem.row.id)
        getTableData()
    }
    centerDialogVisible.value = false
}

const getSummaries = (param) => {
    const { columns } = param
    const sums = []
    const calcPropertyArr = ['totalProfit', 'commission', 'profit']
    columns.forEach((column, index) => {
        if (index === 0) {
            sums[index] = '总计'
        } else if (!calcPropertyArr.includes(column.property)) {
            sums[index] = '--'
        } else {
            sums[index] = orderCountNum.value[column.property] || '--'
        }
        // const values = data.map((item) => Number(item[column.property]))
        // if (!values.every((value) => Number.isNaN(value))) {
        //     sums[index] = values.reduce((prev, curr) => {
        //         const value = Number(curr)
        //         if (!Number.isNaN(value)) {
        //             return prev + curr
        //         } else {
        //             return prev
        //         }
        //     }, 0)
        //     sums[index] = sums[index].toFixed(2)
        // } else {
        //     sums[index] = '--'
        // }
    })
    return sums
}

const searchHandle = () => {
    getTableData()
}

const changeInputHandle = () => {
    getTableData()
}

const selectDate = (num) => {
    if (typeof num === 'number') {
        searchParams.date = [getDateByStep(searchParams.date[0], num), getDateByStep(searchParams.date[1], num)]
    }
    getTableData()
}

const resetHandle = () => {
    searchParams.name = ''
    searchParams.openOrClose = ''
    searchParams.buyOrSale = ''
    searchParams.date = [new Date(), new Date()]
    searchParams.startDate = ''
    searchParams.endDate = ''
    searchParams.status = 0
    getTableData()
}

const submitHandle = async () => {
    if (!submitData.name.length) {
		uni.showToast({
			title: '请选择角色',
			duration: 2000,
			icon: 'error'
		})
        return
    }
    const params = {
        date: dateFormat(new Date(submitData.date), 'yyyy-MM-dd'),
        num: Number((submitData.num + submitData.subNum).toFixed(5)) || 0,
        name: submitData.name.join(','),
        remark: submitData.remark,
    }
    const res = await fetchInsertIncome(params)
    if (res.success) {
        submitData.name = [...accountName.value]
        submitData.num = 0
        submitData.subNum = 0
        submitData.remark = ''
		uni.showToast({
			title: '录入成功',
			duration: 2000,
			icon: 'success'
		})
    }
}

const formatSubmitNum = () => {
    submitData.name = accountName.value.slice(0, 2)
    const num = orderCountNum.value.totalProfit || 0
    submitData.num = Number((num * _rate_).toFixed(2))
    submitData.remark = `大号${submitData.num}，小号{${submitData.subNum}}`
}
const formatSubmitRestNum = () => {
    submitData.name = [accountName.value[accountName.value.length - 1]]
    const num = orderCountNum.value.totalProfit || 0
    submitData.num = Number((num - Number((num * _rate_).toFixed(2)) * 2).toFixed(2))
    submitData.subNum = 0
    submitData.remark = ''
}
const inputSubNumHandle = () => {
    if (submitData.name.length > 1) {
        submitData.remark = `大号${submitData.num}，小号{${submitData.subNum}}`
    }
}

const showSubmitViewHandle = () => {
    importDialogVisible.value = true
    submitData.name = accountName.value.slice(0, 2) // 默认选择账户前2位角色
    submitData.date = Date.parse(searchParams.date[0]) === Date.parse(searchParams.date[1]) ? searchParams.date[0] : new Date()
}

const initTable = () => {
    if (activeOrderTab.value === 'table') {
        nextTick(() => {
            if (!orderTableHeight.value) {
                orderTableHeight.value = tableTabWrap.value.getBoundingClientRect().height
                    - searchInputWrap.value.getBoundingClientRect().height
                    - 48
                // searchParams.pageSize = Math.ceil((orderTableHeight.value - 80) / 40)
                // searchParams.pageSize = searchParams.pageSize < 0 ? 10 : searchParams.pageSize
            }
            getTableData()
        })
    }
}

watch(isLogin, (value) => {
    if (value) {
        initTable()
    } else {
        setOrderList([]) // 清空数据
    }
})

watch(activeOrderTab, () => {
    initTable()
})

onMounted(() => {
    initTable()
})
</script>

<style lang="scss">
page {
	height: 100%;
}
.uni-table-scroll {
	height: 100%;
	overflow-y: auto;
}
</style>

<style scoped>
.order-wrap {
	font-size: 14px;
	height: 100%;
	display: flex;
	flex-direction: column;
}
.search-wrap {
	flex-shrink: 0;
}
.future-table {
    flex: 1;
	overflow: hidden;
}
.table-search-input-wrap {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding-left: 12px;
    font-size: 12px;
    background: white;
}
.search-item-wrap {
    display: flex;
    align-items: center;
    color: #606266;
    margin: 0 0 16px 0;
	padding: 0 12px;
}
.search-item-wrap text {
    flex-shrink: 0;
}
.table-input-wrap {
    background: #fff;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}
.table-input-item-wrap {
    display: flex;
    align-items: center;
    padding-top: 16px;
    font-size: 12px;
    color: #606266;
}
.table-input-item-wrap:first-of-type {
    padding-top: 0;
}
.table-input-item-wrap text {
    flex-shrink: 0;
}
.pagination-wrap { 
    flex-shrink: 0;
	padding: 4px 0;
}
</style>
