import store from '@/store'

class HttpRequest {
	constructor(baseUrl = '') {
		this.baseUrl = baseUrl
	}
	
	getInsideConfig() {
		// #ifdef MP-WEIXIN
		const config = {
			baseURL: this.baseUrl,
			withCredentials: true,
			header: {
				'cookie': this.getCookies(), // 获取当前所有 cookie
			}
		}
		// #endif
		
		// #ifndef MP-WEIXIN
		const config = {
			baseURL: this.baseUrl,
			withCredentials: true,
		}
		// #endif
		return config
	}
	
	getCookies() {
		return uni.getStorageSync('future-token') || ''
	}

	request(options) {
		options = Object.assign(this.getInsideConfig(), options)
		const { data = {}, params = {} } = options

		return new Promise(resolve => {
			const requestTask = uni.request({
				method: options.method || 'GET',
				url: options.baseURL +  options.url || '',
				data: Object.assign(data, params),
				header: options.header || {},
				responseType: options.responseType || 'text',
				success: (res) => {
					const resData = res.data || {}
					const cookies = res.cookies || []
					const { data, success, msg, code } = resData
					if (code === 403) {
						ElMessage.error('登录已失效')
						store.dispatch('app/logoutAction')
					} else if (success === false) { // 服务器返回错误代码
						ElMessage.error(msg)
					}
					resData.cookies = cookies
					resolve(resData)
				},
				fail: (res) => {
					console.log(res)
				}
			})
		})
	}
}

export default HttpRequest
