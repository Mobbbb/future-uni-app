
export default {
	data() {
		return {
			_shareInfo: {
				title: '',
				path: '',
				imageUrl: '', // 分享图-默认截取当前页面图片
				desc: '',
			},
			_infoChanged: false,
		}
	},
	onLoad() {
		if (wx.showShareMenu) {
			wx.showShareMenu({
				menus: ['shareAppMessage', 'shareTimeline']
			})
		}
	},
	// 发送给朋友
	onShareAppMessage() {
		const returnInfo = {}
		if (this._infoChanged) { // 自定义分享
			returnInfo.title = this._shareInfo.title
			returnInfo.path = this._shareInfo.path
			returnInfo.imageUrl = this._shareInfo.imageUrl
			returnInfo.desc = this._shareInfo.desc
		} else { // 默认分享
			const pages = getCurrentPages()
			const currentPage = pages[pages.length - 1]
			const { options, route } = currentPage || {}

			returnInfo.title = '期货小助手记录复盘交易数据'
			returnInfo.path = route
			returnInfo.imageUrl = '/static/wx-share-img.png'
			returnInfo.desc = ''
		}
		this._infoChanged = false
		return returnInfo
	},
	// 分享到朋友圈
	onShareTimeline() {
		const returnInfo = {}
		if (this._infoChanged) { // 自定义分享
			returnInfo.title = this._shareInfo.title
			returnInfo.path = this._shareInfo.path
			returnInfo.imageUrl = this._shareInfo.imageUrl
		} else { // 默认分享
			const pages = getCurrentPages()
			const currentPage = pages[pages.length - 1]
			const { options, route } = currentPage || {}

			returnInfo.title = '期货小助手记录复盘交易数据'
			returnInfo.path = route
			returnInfo.imageUrl = ''
		}
		this._infoChanged = false
		return returnInfo
	},
	methods: {
		setShareInfo({ title = '', path = '', imageUrl = '',  desc = '' }) {
			this._shareInfo.title = title
			this._shareInfo.path = path
			this._shareInfo.imageUrl = imageUrl
			this._shareInfo.desc = desc
			this._infoChanged = true
		},
	},
}