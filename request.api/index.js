import HttpRequest from '@/utils/request.js'

// #ifdef MP-WEIXIN
/**
 * @description 微信正式环境
 */
export const prefixApi = '/api/future'
export const baseUrl = 'https://www.mobbbb.top'

/**
 * @description 微信测试环境
 */
// export const prefixApi = ''
// export const baseUrl = 'http://127.0.0.1:3002'
// #endif

// #ifndef MP-WEIXIN
export const prefixApi = '/api/future'
export const baseUrl = ''
// #endif

const axios = new HttpRequest(baseUrl)

export const fetchUserLogin = (uid, password, captcha) => {
    return axios.request({
        url: prefixApi + '/user/login',
        method: 'post',
        data: { uid, password, captcha },
    })
}

export const fetchLoginByCode = (code, provider) => {
    return axios.request({
        url: prefixApi + '/user/loginByCode',
        method: 'post',
        data: { code, provider },
    })
}

export const fetchUserRegister = (uid, password, code, provider) => {
    return axios.request({
        url: prefixApi + '/user/register',
        method: 'post',
        data: { uid, password, code, provider },
    })
}

export const fetchUserInfo = () => {
    return axios.request({
        url: prefixApi + '/user/info',
        method: 'get',
    })
}

export const fetchCheckOpenId = (code, provider) => {
    return axios.request({
        url: prefixApi + '/user/checkOpenId',
        method: 'post',
        data: { code, provider },
    })
}

export const updateUserInDayFirstLists = (lists) => {
    return axios.request({
        url: prefixApi + '/user/updateUserInDayFirstLists',
        method: 'post',
        data: { lists },
    })
}

export const updateUserEmail = (email) => {
    return axios.request({
        url: prefixApi + '/user/updateUserEmail',
        method: 'post',
        data: { email },
    })
}

export const setOpenid = ({ code, provider }) => {
    return axios.request({
        url: prefixApi + '/user/setOpenid',
        method: 'post',
        data: { code, provider },
    })
}

export const updateUserAvatar = (avatar) => {
    return axios.request({
        url: prefixApi + '/user/updateUserAvatar',
        method: 'post',
        data: { avatar },
    })
}

export const updateUserInfo = ({ name, remark, commissionType }) => {
    return axios.request({
        url: prefixApi + '/user/updateUserInfo',
        method: 'post',
        data: { name, remark, commissionType },
    })
}

export const updateSubscribe95 = (status) => {
    return axios.request({
        url: prefixApi + '/user/updateSubscribe95',
        method: 'post',
        data: { status },
    })
}

export const getAllOilList = (status) => {
    return axios.request({
        url: prefixApi + '/other/getAllOilList',
        method: 'get',
    })
}

export const getOilDate = () => {
    return axios.request({
        url: prefixApi + '/other/selectDateFlag?id=2',
        method: 'get',
    })
}

export const fetchListData = () => {
    return axios.request({
        url: '/resource/future/message.json',
        method: 'get',
    })
}

export const fetchFlag = () => {
    return axios.request({
        url: prefixApi + '/other/selectAllFlag',
        method: 'get',
    })
}

export const updateFlagStatus = (params) => {
    return axios.request({
        url: prefixApi + '/other/updateStatus',
        method: 'get',
        params,
    })
}

export const fetchRebateInfo = () => {
    return axios.request({
        url: prefixApi + '/other/rebateInfo',
        method: 'get',
    })
}

export const fetchIncomeInfo = () => {
    return axios.request({
        url: prefixApi + '/other/incomeInfo',
        method: 'get',
    })
}

export const fetchRecentlyFeature = () => {
    return axios.request({
        url: prefixApi + '/other/recentlyFeature',
        method: 'get',
    })
}

export const fetchInsertIncome = (params) => {
    return axios.request({
        url: prefixApi + '/other/insertIncome',
        method: 'post',
        data: params,
    })
}

export const fetchDeleteIncome = (id) => {
    return axios.request({
        url: prefixApi + '/other/deleteIncome',
        method: 'get',
        params: { id },
    })
}

export const fetchOrderInfo = (params) => {
    return axios.request({
        url: prefixApi + '/other/orderInfo',
        method: 'post',
        data: params,
    })
}

export const fetchOrderInfoByUserId = (params) => {
    return axios.request({
        url: prefixApi + '/other/orderInfoByUserId',
        method: 'post',
        data: params,
    })
}

export const fetchOrderInfoByUserIdHandle = async (params) => {
    const res = await fetchOrderInfoByUserId(params)
    const data = res.data || {}
    const { result = [], commission, profit, totalProfit, total } = data
    return {
        commission,
        profit,
        totalProfit,
        total: total || 0,
        result,
        success: res.success,
    }
}

export const fetchOrderInfoHandle = async (params) => {
    const res = await fetchOrderInfo(params)
    const data = res.data || {}
    const { result = [], commission, profit, totalProfit, total } = data
    return {
        commission,
        profit,
        totalProfit,
        total: total || 0,
        result,
    }
}

export const fetchInsertOrder = (params) => {
    return axios.request({
        url: prefixApi + '/other/insertOrder',
        method: 'post',
        data: params,
    })
}

export const fetchDeleteOrder = (id) => {
    return axios.request({
        url: prefixApi + '/other/deleteOrder',
        method: 'get',
        params: { id },
    })
}

export const fetchCancelOrder = (params) => {
    return axios.request({
        url: prefixApi + '/other/cancelOrder',
        method: 'post',
        data: params,
    })
}

export const fetchFutureConfigInfo = () => {
    return axios.request({
        url: prefixApi + '/other/futureConfigInfo',
        method: 'get',
    })
}

export const fetchOpeningOrderInfo = () => {
    return axios.request({
        url: prefixApi + '/other/openingOrderInfo',
        method: 'get',
    })
}

export const fetchFutureDayShareInfo = (params) => {
    return axios.request({
        url: prefixApi + '/other/futureDayShareInfo',
        method: 'post',
        data: params,
    })
}

export const fetchFutureDayLineInfo = (params) => {
    return axios.request({
        url: prefixApi + '/other/futureDayLineInfo',
        method: 'post',
        data: params,
    })
}

export const fetchFuturePositionInfo = (params) => {
    return axios.request({
        url: prefixApi + '/other/futurePositionInfo',
        method: 'post',
        data: params,
    })
}

export const fetchIncomeLatestInfo = () => {
    return axios.request({
        url: prefixApi + '/other/incomeLatestInfo',
        method: 'get',
    })
}

export const fetchfutureLatestInfo = () => {
    return axios.request({
        url: prefixApi + '/other/futureLatestInfo',
        method: 'get',
    })
}

export const fetchFutureFestivalInfo = (params) => {
    return axios.request({
        url: prefixApi + '/other/futureFestivalInfo',
        method: 'get',
        params,
    })
}

export const fetchAppVersion = () => {
    return axios.request({
        url: prefixApi + '/other/getNewAppVersion',
        method: 'get',
    })
}

export const fetchCaptcha = () => {
    return axios.request({
        url: prefixApi + '/common/captcha',
        method: 'get',
    })
}
