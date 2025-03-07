import { dateFormat, dateGap, calculateDate } from './umob.js'

export const genVH = (length) => {
    let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    if (!clientHeight) return length
    return length * clientHeight / 800
}

export function circleDom(color, size, left = 0, right = 4) {
    return `<span style="display: inline-block; width: ${size}px; height: ${size}px; border-radius: 50%; background: ${color}; margin: 0 ${right}px 2px ${left}px;vertical-align: middle;"></span>`
}

export const parseDateParams = (dateParams) => {
    const params = {}
    if (dateParams[0]) {
        let prevDay = Date.parse(new Date(dateParams[0])) - 24 * 60 * 60 * 1000
        if (new Date(prevDay).getDay() === 0) { // 前一天是周日
            prevDay -= 2 * 24 * 60 * 60 * 1000
        }
        if (new Date(prevDay).getDay() === 6) { // 前一天是周六
            prevDay -= 1 * 24 * 60 * 60 * 1000
        }
        params.startDate = dateFormat(prevDay) + ' 20:55:00'
    }
    if (dateParams[1]) {
        let endDay = Date.parse(new Date(dateParams[1]))
        
        if (dateParams[0] === dateParams[1]) {
            if (new Date(endDay).getDay() === 0) { // 周日
                endDay += 1 * 24 * 60 * 60 * 1000
            } else if (new Date(endDay).getDay() === 6) { // 周六
                endDay += 2 * 24 * 60 * 60 * 1000
            }
        }

        params.endDate = dateFormat(endDay) + ' 20:54:59'
    }
    return params
}

export const getGapDate = (gap = 1) => {
    const end = new Date()
    const start = new Date()

    let deltaDay = 0
    if (end.getHours() >= 21) { // 9点之后，区间往后延一天
        deltaDay ++
        end.setTime(end.getTime() + 3600 * 1000 * 24 * 1)
    }
    if (new Date(end).getDay() === 0) { // 明天是周日
        deltaDay ++
        end.setTime(end.getTime() + 3600 * 1000 * 24 * 1)
    } else if (new Date(end).getDay() === 6) { // 明天是周六
        deltaDay = deltaDay + 2
        end.setTime(end.getTime() + 3600 * 1000 * 24 * 2)
    }

    start.setTime(start.getTime() - 3600 * 1000 * 24 * (gap - deltaDay - 1))
    return [start, end]
}

/**
 * @description 获取归属的交易日期
 * @param {String} time yyyy-MM-dd hh:mm:ss 实际交易日期
 * @returns date yyyy-MM-dd 归属日期
 */
export const getBelongDealDate = (time) => {
    const date = new Date(time)
    const hours = Number(time.slice(11, 13))

    if (hours >= 21) { // 9点之后，区间往后延一天
        date.setTime(date.getTime() + 3600 * 1000 * 24 * 1)
    }
    if (new Date(date).getDay() === 0) { // 明天是周日
        date.setTime(date.getTime() + 3600 * 1000 * 24 * 1)
    } else if (new Date(date).getDay() === 6) { // 明天是周六
        date.setTime(date.getTime() + 3600 * 1000 * 24 * 2)
    }

    return dateFormat(date)
}

export const getBelongDealDateD = (time) => {
    const date = time
    const hours = time.getHours()

    if (hours >= 21) { // 9点之后，区间往后延一天
        date.setTime(date.getTime() + 3600 * 1000 * 24 * 1)
    }
    if (new Date(date).getDay() === 0) { // 明天是周日
        date.setTime(date.getTime() + 3600 * 1000 * 24 * 1)
    } else if (new Date(date).getDay() === 6) { // 明天是周六
        date.setTime(date.getTime() + 3600 * 1000 * 24 * 2)
    }

    return date
}

/**
 * @description 获取归属的交易日期区间
 * @param {String} time yyyy-MM-dd hh:mm:ss
 * @returns {Array} yyyy-MM-dd
 */
export const getBelongDealDateGap = (time) => {
    const date = new Date(time)
    const hours = Number(time.slice(11, 13))
    const strDate = time.slice(0, 10)

    if (hours >= 21) { // 9点之后，区间往后延一天
        date.setTime(date.getTime() + 3600 * 1000 * 24 * 1)

        if (new Date(date).getDay() === 0) { // 明天是周日
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 1)
        } else if (new Date(date).getDay() === 6) { // 明天是周六
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 2)
        }

        return [`${strDate} 20:55:00`, `${dateFormat(date)} 20:54:59`]
    } else {
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 1)

        if (new Date(date).getDay() === 0) { // 前一天是周日
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 2)
        } else if (new Date(date).getDay() === 6) { // 前一天是周六
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 1)
        }

        return [`${dateFormat(date)} 20:55:00`, `${strDate} 20:54:59`]
    }
}

export const getMonthShortcuts = (num = 5) => {
    const now = dateFormat(new Date(), 'yyyy-MM')
    return dateGap(calculateDate(now, -num + 1), now).map(item => {
        const endDate = new Date(...item.split('-'), 0)
        if (endDate.getDay() === 0) { // 月底是周日
            endDate.setTime(endDate.getTime() - 3600 * 1000 * 24 * 2)
        } else if (endDate.getDay() === 6) { // 月底是周六
            endDate.setTime(endDate.getTime() - 3600 * 1000 * 24 * 1)
        }
        return {
            text: item.split('-').join('.'),
            value: [`${item}-01`, dateFormat(endDate)],
        }
    }).reverse()
}

export const getDateByStep = (date, num) => {
    let currentDate = calculateDate(date, num)

    const day = new Date(currentDate).getDay()
    
    if (day === 0 || day === 6) { // 跳过周末
        currentDate = getDateByStep(currentDate, num)
    }

    return currentDate
}

export function calculatePearsonCorrelation(data1, data2) {
    // 计算平均值函数
    function mean(data) {
        return data.reduce((acc, val) => acc + val, 0) / data.length
    }

    // 计算皮尔逊相关系数函数
    function pearsonCorrelation(data1, data2) {
        if (data1.length !== data2.length) {
            throw "两组数据长度不相等"
        }

        const mean1 = mean(data1)
        const mean2 = mean(data2)

        let numerator = 0
        let denominator1 = 0
        let denominator2 = 0

        for (let i = 0; i < data1.length; i++) {
            numerator += (data1[i] - mean1) * (data2[i] - mean2)
            denominator1 += Math.pow(data1[i] - mean1, 2)
            denominator2 += Math.pow(data2[i] - mean2, 2)
        }

        return numerator / Math.sqrt(denominator1 * denominator2)
    }

    // 计算皮尔逊相关系数
    return pearsonCorrelation(data1, data2)
}

/**
 * @description Uni-App
 * @description 获取导航栏高度信息
 */
export const getMenuButtonBoundingClientRect = () => {
	let statusBarHeight = uni.getStorageSync('statusBarHeight') || 0
	let platform = uni.getStorageSync('platform')
	if (!statusBarHeight || !platform) {
		const res = uni.getSystemInfoSync()
		statusBarHeight = res.statusBarHeight
		platform = res.platform
		uni.setStorageSync('statusBarHeight', statusBarHeight)
		uni.setStorageSync('platform', platform)
	}
	
	let navBarHeight = uni.getStorageSync('navBarHeight')
	if (!navBarHeight) {
		// 计算navBarHeight
		if (uni.getMenuButtonBoundingClientRect) { // 获取胶囊信息
			let menuInfo = uni.getStorageSync('menuInfo')
			if (!menuInfo) menuInfo = uni.getMenuButtonBoundingClientRect()
			if (menuInfo) {
				uni.setStorageSync('menuInfo', menuInfo) // 保存胶囊信息
				navBarHeight = menuInfo.height + (menuInfo.top - statusBarHeight) * 2
			} else {
				navBarHeight = platform === 'android' ? 48 : 44
			}
		} else {
			navBarHeight = platform === 'android' ? 48 : 44
		}
	}
	
	uni.setStorageSync('navBarHeight', navBarHeight)
	
	return {
		navBarHeight, // 导航栏高度
		statusBarHeight, // 状态栏高度
	}
}

/**
 * @description btoa
 * @description 将字符串转换为 Base64 编码
 */
export function base64Encode(str) {
	let CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
	let out = '', i = 0, len = str.length, c1, c2, c3, enc1, enc2, enc3, enc4
	while (i < len) {
		c1 = str.charCodeAt(i++)
		c2 = str.charCodeAt(i++)
		c3 = str.charCodeAt(i++)
		enc1 = c1 >> 2
		enc2 = ((c1 & 3) << 4) | (c2 >> 4)
		enc3 = ((c2 & 15) << 2) | (c3 >> 6)
		enc4 = c3 & 63
		if (isNaN(c2)) {
			enc3 = enc4 = 64
		} else if (isNaN(c3)) {
			enc4 = 64
		}
		out += CHARS.charAt(enc1) + CHARS.charAt(enc2) + CHARS.charAt(enc3) + CHARS.charAt(enc4)
	}
	return out
}

export const addWxCookie = (key, cookies) => {
	const newCookies = []
	cookies.forEach(item => {
		newCookies.push(item.split(';')[0])
	})
	const currentCookies = (uni.getStorageSync(key) || '').split(';')
	
	let resCookies = []
	newCookies.forEach(item => {
		resCookies.push(item)
		const cookiePair = item.split('=')
		for (let i = 0; i < currentCookies.length; i++) {
			const cellCookiePair = currentCookies[i].split('=')
			if (cookiePair[0].trim() === cellCookiePair[0].trim()) {
				currentCookies.splice(i, 1)
				break
			}
		}
	})
	resCookies = resCookies.concat(currentCookies)
	uni.setStorageSync(key, resCookies.join(';'))
}

/**
 * @description Uni-App
 */
export const canvasToImage = (canvasId) => {
	return new Promise(resolve => {
		if (!uni.canvasToTempFilePath) {
			resolve({
				data: '',
				success: false,
				msg: 'canvasToTempFilePath does not exist',
			})
		} else if (!uni.getFileSystemManager) {
			resolve({
				data: '',
				success: false,
				msg: 'getFileSystemManager does not exist',
			})
		} else {
			uni.canvasToTempFilePath({
				canvasId,
				success: (res) => {
					const fileSystemManager = uni.getFileSystemManager()
					fileSystemManager.saveFile({
						tempFilePath: res.tempFilePath,
						success: (saveRes) => {
							resolve({
								data: saveRes.savedFilePath,
								success: true,
								msg: '',
							})
						},
						fail: (e) => {
							resolve({
								data: '',
								success: false,
								msg: e,
							})
						},
					})
				},
				fail: (e) => {
					resolve({
						data: '',
						success: false,
						msg: e,
					})
				},
			})
		}
	})
}
