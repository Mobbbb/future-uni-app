export const getAppendBlock = (num, lineMaxNum) => {
    if (num % lineMaxNum) {
        return lineMaxNum - num % lineMaxNum
    }
    return 0
}

export const getCacheList = async () => {
    const obj = {}
    if ('caches' in window) {
        const cachesKeys = await caches.keys()
        if (cachesKeys.includes('dc-model')) {
            const dcModelCache = await caches.open('dc-model')
            const cachedRequests = await dcModelCache.keys()
            cachedRequests.forEach(request => {
                if (request.url.indexOf('character.dat') > -1) {
                    const urlArr = request.url.split('/')
                    const modelName = urlArr[urlArr.length - 2] || ''
                    const childName = modelName.split('_')[0] || ''
                    if (childName) {
                        obj[childName] = 1
                    }
                }
            })
        }
    }
    return obj
}

export function dateFormat(date, fmt = 'yyyy-MM-dd') {
    if (!(date instanceof Date)) {
        date = new Date(date)
    }
    var a = ['日', '一', '二', '三', '四', '五', '六']
    var o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds(), // 毫秒
        'w': date.getDay(), // 周
        'W': a[date.getDay()], // 大写周
        'T': 'T'
    }
    if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)) }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
    }
    return fmt
}

export function isPWA() {
    return navigator.standalone === true || !!(window.matchMedia('(display-mode: standalone)').matches)
}

export function debounce(fn, argWait, immediate) {
    if (immediate === void 0) { immediate = true; }
    var wait = Number(argWait) || 0;
    var timestampProvider = typeof performance === 'object' ? performance : Date;
    var timeout;
    var args;
    var context;
    var timestamp;
    var result;
    var later = function () {
        var last = timestampProvider.now() - timestamp;
        // 每次调用都会更新timestamp的值，如果时间间隔没有超过wait，那么启用新的定时器
        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
        }
        else {
            timeout = null;
            if (!immediate) {
                result = fn.apply(context, args);
                if (!timeout) {
                    context = null;
                    args = null;
                }
            }
        }
    };
    return function () {
        var restArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            restArgs[_i] = arguments[_i];
        }
        context = this;
        args = restArgs;
        timestamp = timestampProvider.now();
        // 立即执行
        var callNow = immediate && !timeout;
        if (!timeout)
            timeout = setTimeout(later, wait);
        if (callNow) {
            result = fn.apply(context, args);
            context = null;
            args = null;
        }
        return result;
    };
}
