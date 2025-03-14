import { fetchUserInfo, fetchListData, baseUrl } from '@/request.api/index.js'
import { delCookie, getCookie, dateFormat } from '@/utils/umob.js'
import { addWxCookie } from '@/utils'

const app = {
    namespaced: true,
    state() {
        return {
            navHeight: 60,
            mainGap: [32, 0, 8, 0],
            mainWidth: {
                width: 0.62,
                minWidth: 332,
            },
			screenInfo: {
				width: 0,
				height: 0,
			},
            mediaCriticalValue: 544, // 响应式临界尺寸

            homeListData: [],
            homeTotalListData: [],

            activeNavIndex: '',
            activeIncomeTab: 'day',
            activeOrderTab: 'order',
            activeDataTab: 'dayKline',

            showLoginDrawerStatus: false,
            closeSettingShowStatus: false,
            switchUserFlag: false,

            goods: {
                type: '',
                lot: 1,
                pricePrev: 0,
                priceNext: 0,
            },
            USER_INFO: {}, // 用户信息
        }
    },
    getters: {
        mainStyle(state) {
            return {
                marginTop: `${state.mainGap[0]}px`,
                width: `${state.mainWidth.width * 100}%`,
                minWidth: `${state.mainWidth.minWidth}px`,
                height: `calc(100% - ${state.mainGap[0] + state.mainGap[2]}px)`,
            }
        },
        overMediaCritical(state) {
            return screenInfo.width < state.mediaCriticalValue
        },
        isLogin(state) {
            return !!state.USER_INFO.userId
        },
        avatarImg(state) {
            const avatar = state.USER_INFO.avatar || ''
            if (avatar.indexOf('http') > -1) {
            	return avatar
            } else if (avatar) {
				return baseUrl + avatar
			}
            
            return ''
        },
		isProExpire(state) {
            if (state.USER_INFO.proTime) {
                return state.USER_INFO.proTime < dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
            }
            return false
        },
    },
    mutations: {
        setActiveIncomeTab(state, value) {
            state.activeIncomeTab = value
        },
        setActiveOrderTab(state, value) {
            state.activeOrderTab = value
        },
        setActiveDataTab(state, value) {
            state.activeDataTab = value
        },
        setGoodsType(state, value) {
            state.goods.type = value
        },
        setGoodsLot(state, value) {
            state.goods.lot = value
        },
        setGoodsPricePrev(state, value) {
            state.goods.pricePrev = value
        },
        setGoodsPriceNext(state, value) {
            state.goods.priceNext = value
        },
        setHomeListData(state, value) {
            state.homeListData = value
        },
        setHomeTotalListData(state, value) {
            state.homeTotalListData = value
        },
        updateActiveNavIndex(state, value) {
            state.activeNavIndex = value
        },
        toLoginPage(state, value) {
			uni.navigateTo({
				url: '/pages/login/index',
			})
        },
        setCloseSettingShowStatus(state, value) {
            state.closeSettingShowStatus = value
        },
        setInDayFirstLists(state, value) {
            state.USER_INFO.inDayFirstLists = value
        },
		setSubscribe95(state, value) {
            state.USER_INFO.subscribe95 = value
        },
		setScreenInfo(state, value) {
            state.screenInfo = value
        },
        SET_USER_INFO(state, value) {
            state.USER_INFO = value
        },
    },
    actions: {
        async INIT_USER({ commit, dispatch }) {
            const userId = getCookie('future-uid')
            if (userId) { // 获取用户相关信息
                commit('SET_USER_INFO', { userId })
                const res = await fetchUserInfo()
                const { data = {} } = res
                if (data.uid) {
					data.userId = data.uid
					data.inDayFirstLists = data.inDayFirstLists.split(',')
                    commit('SET_USER_INFO', data)
                    // dispatch('updateLocalAvatar', {
                    //     uid,
                    //     avatar,
                    // })
                }
            }
        },
        logoutAction({ commit, dispatch }) {
            dispatch('logoutImmAction')
            setTimeout(() => {
                uni.switchTab({
                    url: '/pages/mine/index',
                })
            }, 1000)
        },
        logoutImmAction({ commit, dispatch }) {
            dispatch('removeLoginStorage')
            commit('SET_USER_INFO', {})
            delCookie('future-uid')
            delCookie('future-token')
        },
        saveLoginStatus({}, data) {
            const { uid, avatar, cookies } = data

            let loginList = uni.getStorageSync('future-login-list')

			// #ifdef MP-WEIXIN
			uni.setStorageSync('future-uid', uid)
			addWxCookie('future-token', cookies)
			// #endif
			
            if (loginList) {
                loginList = JSON.parse(loginList)
            } else {
                loginList = []
            }
            
            loginList = loginList.filter(item => item.uid !== uid)
            loginList.unshift({
                uid,
                avatar,
                token: getCookie('future-token'),
            })
            uni.setStorageSync('future-login-list', JSON.stringify(loginList))
        },
        updateLocalAvatar({}, data) {
            const { uid, avatar } = data
            let loginList = uni.getStorageSync('future-login-list')
            if (loginList) {
                loginList = JSON.parse(loginList)
            } else {
                loginList = []
            }
            for (let i = 0; i < loginList.length; i++) {
                if (loginList[i].uid === uid && loginList[i].avatar !== avatar) {
                    loginList[i].avatar = avatar
                    uni.setStorageSync('future-login-list', JSON.stringify(loginList))
                    break
                }
            }
        },
        removeLoginStorage({ state }) {
            let loginList = uni.getStorageSync('future-login-list')
            if (loginList) {
                loginList = JSON.parse(loginList)
            } else {
                loginList = []
            }
            loginList = loginList.filter(item => item.uid !== state.USER_INFO.userId)
            uni.setStorageSync('future-login-list', JSON.stringify(loginList))
        },
        async requestHomeList({ commit }) {
            let result = await fetchListData()
            
            if (result instanceof Array && result.length) {
                result.sort((a, b) => b.id - a.id)
                result.forEach((item, index) => {
                    item.index = index
                    if (item.htmlContent.indexOf('qzone/em') > -1) {
                        const splitStr = item.htmlContent.split('<img src="')
                        item.htmlContent = splitStr.join('<img src="//qzonestyle.gtimg.cn')
                    }
                    if (item.htmlContent.indexOf('&nbsp;<br  />') > -1) {
                        item.htmlContent = item.htmlContent.replace('&nbsp;<br  />', '<br  />')
                    }
                    if (item.htmlContent.indexOf('<br  />&nbsp;') > -1) {
                        item.htmlContent = item.htmlContent.replace('<br  />&nbsp;', '<br  />')
                    }
                })
                commit('setHomeTotalListData', JSON.parse(JSON.stringify(result)))
                commit('setHomeListData', result)

                let obj = {}
                obj[window.version] = result
                uni.setStorageSync('message-list', JSON.stringify(obj))
                return true
            }
            return false
        }
    },
}

export default app
