/**
 * @description 将参数转化为日期格式
 * @param {*} params 入参支持字符串、数字的转化，字符串支持yyyy(\D)?MM(\2)dd、yyyy(\D)?MM(\2)dd hh:mm:ss格式，数字将被识别为时间戳
 * @return {Date} 返回日期
 */
function toDate(params) {
    if (params instanceof Date)
        return params;
    if (typeof params === 'number')
        return new Date(params);
    var paramsDate = '';
    if (typeof params === 'string')
        paramsDate = params;
    var dateRegex = /^(\d{4})(\D)?(\d{2})\2(\d{2})(\s(\d{2}):(\d{2}):(\d{2}))?$/;
    var match = paramsDate.match(dateRegex) || [];
    var monthRegex = /^(\d{4})\D?(\d{2})$/;
    var monthMatch = paramsDate.match(monthRegex);
    var INVALID_DATE = new Date('');
    var year = 0;
    var month = 0;
    var day = 1;
    var hours = 0;
    var minutes = 0;
    var seconds = 0;
    if (match.length) {
        year = parseInt(match[1], 10);
        month = parseInt(match[3], 10) - 1;
        day = parseInt(match[4], 10);
        hours = parseInt(match[6], 10) || 0;
        minutes = parseInt(match[7], 10) || 0;
        seconds = parseInt(match[8], 10) || 0;
    }
    else if (monthMatch) {
        year = parseInt(monthMatch[1], 10);
        month = parseInt(monthMatch[2], 10) - 1;
    }
    else {
        return INVALID_DATE;
    }
    var date = new Date(year, month, day, hours, minutes, seconds);
    if (date.getFullYear() !== year ||
        date.getMonth() !== month ||
        date.getDate() !== day) { // 输入的年月日时分秒不合法
        return INVALID_DATE;
    }
    return date;
}

/**
 * @description 判断是否为有效的日期
 * @param {*} variable
 * @returns {Boolean}
 */
function isVaildDate(variable) {
    return variable instanceof Date && !Number.isNaN(variable.getTime());
}

/**
 * @description 时间格式化
 * @param {*} argDate 日期
 * @param {String} argFmt 日期格式
 * @returns {String} date
 */
function dateFormat(argDate, argFmt) {
    if (argFmt === void 0) { argFmt = 'yyyy-MM-dd'; }
    var date = toDate(argDate);
    var fmt = argFmt;
    if (!isVaildDate(date))
        return '';
    var week = ['日', '一', '二', '三', '四', '五', '六'];
    var o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        S: date.getMilliseconds(),
        w: date.getDay(),
        W: week[date.getDay()],
        T: 'T',
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, String(date.getFullYear()).substr(4 - RegExp.$1.length));
    }
    Object.keys(o).forEach(function (k) {
        if (new RegExp("(".concat(k, ")")).test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : "00".concat(o[k]).substr(String(o[k]).length));
        }
    });
    return fmt;
}

/**
 * @description 将参数转化为yyyy-MM格式
 * @param {*} params 入参
 * @return {Date} 返回yyyy-MM格式的日期，无法转化将返回空字符串
 */
function toMonth(params) {
    var paramsDate = '';
    if (typeof params === 'string')
        paramsDate = params;
    if (typeof params === 'number')
        paramsDate = params.toString();
    var monthRegex = /^(\d{4})\D?(\d{2})$/;
    var match = paramsDate.match(monthRegex);
    if (!match) {
        var dateParse = params;
        if (typeof dateParse === 'number')
            dateParse = dateParse.toString();
        var toDateRes = toDate(dateParse);
        if (isVaildDate(toDateRes)) {
            return dateFormat(toDateRes).slice(0, 7);
        }
        return '';
    }
    var year = match[1];
    var month = match[2];
    // 校验月份的范围
    if (parseInt(month, 10) < 1 || parseInt(month, 10) > 12)
        return '';
    return "".concat(year, "-").concat(month);
}

/**
 * @description 获取两个日期中间的日期
 * @param {*} startDate 开始日期
 * @param {*} endDate 结束日期
 * @param {Object} opt 配置选项
 * @param {Boolean} opt.includeHead 是否包含起始日期
 * @param {Boolean} opt.includeTail 是否包含结尾日期
 * @param {String} opt.format 日期格式化
 * @returns {Array}
 */
function dateGap(startDate, endDate, opt) {
    if (opt === void 0) { opt = {}; }
    var diffdate = [];
    var sTime = toDate(startDate);
    var eTime = toDate(endDate);
    var startDateLength = startDate.toString().length;
    var endDateLength = startDate.toString().length;
    var _a = opt.includeHead, includeHead = _a === void 0 ? true : _a, _b = opt.includeTail, includeTail = _b === void 0 ? true : _b, _c = opt.format, format = _c === void 0 ? 'yyyy-MM-dd' : _c;
    if (isVaildDate(sTime) && isVaildDate(eTime) && startDateLength > 7 && endDateLength > 7) {
        while (sTime < eTime) {
            diffdate.push(dateFormat(sTime, format));
            sTime.setTime(sTime.getTime() + 24 * 3600 * 1000);
        }
        if (includeTail)
            diffdate.push(dateFormat(eTime, format));
    }
    else if (toMonth(startDate) && toMonth(endDate)) {
        var sMonth = toMonth(startDate);
        var eMonth = toMonth(endDate);
        while (sMonth < eMonth) {
            diffdate.push(sMonth);
            var nextMonth = parseInt(sMonth.slice(5, 7), 10) + 1;
            var nextYear = parseInt(sMonth.slice(0, 4), 10);
            nextYear = nextMonth > 12 ? nextYear + 1 : nextYear;
            nextMonth = nextMonth > 12 ? nextMonth - 12 : nextMonth;
            nextMonth = nextMonth < 10 ? "0".concat(nextMonth) : nextMonth;
            sMonth = "".concat(nextYear, "-").concat(nextMonth);
        }
        if (includeTail)
            diffdate.push(eMonth);
    }
    else {
        return [];
    }
    if (!includeHead)
        diffdate.shift();
    return diffdate;
}

/**
 * @description 函数防抖(进电梯), 示例：window.onscroll = debounce(onScroll, 200)
 * @param {Function} fn 需要防抖的方法, 如: 输入框联想、keyup
 * @param {Number} argWait 防抖间隔
 * @param {Boolean} immediate 第一次调用是否立即执行一次fn
 * @returns {Function}
 */
function debounce(fn, argWait, immediate) {
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

/**
 * @description 函数节流(抽帧), 示例：window.onscroll = throttle(onScroll, 200)
 * @param {Function} fn 需要节流的方法, 如: scroll、resize、mousemove
 * @param {Number} argWait 节流间隔
 * @param {Number} immediate 第一次调用是否立即执行一次fn
 * @returns {Function}
 */
function throttle(fn, argWait, immediate) {
    if (immediate === void 0) { immediate = true; }
    var wait = Number(argWait) || 0;
    var timestampProvider = typeof performance === 'object' ? performance : Date;
    var context;
    var args;
    var result;
    var timeout = null;
    var previous = 0;
    var later = function () {
        previous = immediate === false ? 0 : timestampProvider.now();
        timeout = null;
        result = fn.apply(context, args);
        if (!timeout) {
            context = null;
            args = null;
        }
    };
    return function () {
        var restArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            restArgs[_i] = arguments[_i];
        }
        var now = timestampProvider.now();
        // 如果是第一次执行函数且immediate为false, 那么就延时执行
        if (!previous && immediate === false)
            previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = restArgs;
        // 到达触发时间 || 由于机器原因导致时间计算不正确, 那么立即执行`
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = fn.apply(context, args);
            if (!timeout) {
                context = null;
                args = null;
            }
        }
        else if (!timeout) {
            // 如果没有函数调用在等待, 那么就延时执行此次函数调用
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
}

/**
 * @description 获取url的参数
 * @param {String} variable 参数的key，若为空，将返回url所有参数对象
 * @returns {Object | String} 传入variable，则返回variable对应的value，若为空，将返回url所有参数对象
 */
function getUrlParams(variable) {
    var url = window.location.href;
    var queryStartIndex = url.indexOf('?');
    if (queryStartIndex === -1) {
        // URL 没有查询参数
        return variable ? '' : {};
    }
    var queryString = url.substring(queryStartIndex + 1);
    var params = {};
    var regex = /([^&=]+)=([^&]*)/g;
    var match = regex.exec(queryString);
    while (match !== null) {
        var key = decodeURIComponent(match[1]);
        var value = decodeURIComponent(match[2]);
        params[key] = value;
        match = regex.exec(queryString);
    }
    if (variable) {
        return params[variable] || '';
    }
    return params;
}

/**
 * @description 判断是否为对象
 * @param {*} variable
 * @returns {Boolean}
 */
function isObject(variable) {
    return Object.prototype.toString.call(variable) === '[object Object]';
}

var dateRegex = /^(\d{4})?(\D)?(\d{2})(\D)?(\d{2})(\s(\d{2}):(\d{2}):(\d{2}))?$/;
function trans(a, b) {
    var compareA = 0;
    var compareB = 0;
    if (dateRegex.test(a) && dateRegex.test(b)) {
        return {
            compareA: a,
            compareB: b,
        };
    }
    if (typeof a === 'string')
        compareA = Number(a);
    if (typeof b === 'string')
        compareB = Number(b);
    if (typeof a === 'number')
        compareA = a;
    if (typeof b === 'number')
        compareB = b;
    return {
        compareA: compareA,
        compareB: compareB,
    };
}
/**
 * @description sort方法的回调
 * @param {Object} params
 * @param {String} params.key sort item若为对象，key需要传入比对的属性的键值
 * @param {String} params.type desc | asc
 * @returns {Function}
 */
function sortCallback(params) {
    if (params === void 0) { params = {}; }
    var _a = params.type, type = _a === void 0 ? "desc" /* sortType.desc */ : _a, key = params.key;
    var isDesc = type === "desc" /* sortType.desc */;
    var errorNum = Infinity;
    if (isDesc)
        errorNum = -Infinity;
    function compareFn(a, b) {
        var _a = trans(a, b), compareA = _a.compareA, compareB = _a.compareB;
        if (a === null || typeof a === 'undefined')
            compareA = errorNum;
        if (b === null || typeof b === 'undefined')
            compareB = errorNum;
        if (key && isObject(a) && isObject(b)) {
            compareA = trans(a[key], b[key]).compareA;
            compareB = trans(a[key], b[key]).compareB;
            if (a[key] === null || typeof a[key] === 'undefined')
                compareA = errorNum;
            if (b[key] === null || typeof b[key] === 'undefined')
                compareB = errorNum;
        }
        if (Number.isNaN(compareA))
            compareA = errorNum;
        if (Number.isNaN(compareB))
            compareB = errorNum;
        var descExp = 0;
        var ascExp = 0;
        if (compareB > compareA) {
            descExp = 1;
        }
        else if (compareB < compareA) {
            descExp = -1;
        }
        if (compareA > compareB) {
            ascExp = 1;
        }
        else if (compareA < compareB) {
            ascExp = -1;
        }
        return isDesc ? descExp : ascExp;
    }
    return compareFn;
}

/**
 * @description 数组或对象的深度克隆
 * @param {*} obj
 * @returns {*} 返回新的克隆数组或对象
 */
function deepClone(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    if (Array.isArray(obj)) {
        var clonedArray = obj.map(function (item) { return deepClone(item); });
        return clonedArray;
    }
    var clonedObj = {};
    Object.keys(obj).forEach(function (key) {
        clonedObj[key] = deepClone(obj[key]);
    });
    return clonedObj;
}

/**
 * @description 获取cookie
 * @param {String} name cookie键名
 * @returns {String}
 */
function getCookie(name) {
	// #ifdef MP-WEIXIN
    return uni.getStorageSync(name)
	// #endif
	
	// #ifndef MP-WEIXIN
	var cookieArr = document.cookie.split(';');
	for (var i = 0; i < cookieArr.length; i++) {
		var cookiePair = cookieArr[i].split('=');
		if (name === cookiePair[0].trim()) {
			return decodeURIComponent(cookiePair[1]);
		}
	}
    return ''
	// #endif
}
function getCookieFromStr(str, name) {
	var cookieArr = str.split(';');
	for (var i = 0; i < cookieArr.length; i++) {
		var cookiePair = cookieArr[i].split('=');
		if (name === cookiePair[0].trim()) {
			return decodeURIComponent(cookiePair[1]);
		}
	}
    return ''
}

/**
 * @description 删除cookie
 * @param {String} name cookie键名
 * @param {String} domain 所在的域
 */
function delCookie(name, domain) {
	// #ifdef MP-WEIXIN
    uni.removeStorageSync(name)
	// #endif
	
	// #ifndef MP-WEIXIN
    if (domain === void 0) { domain = window.location.hostname; }
    document.cookie = "".concat(name, "=").concat(getCookie(name), ";expires=").concat(new Date(1), ";max-age=0;domain=").concat(domain, ";path=/")
	// #endif
}

/**
 * @description 获取cookie
 * @param {String} cookieName cookie 键名
 * @param {String} cookieValue cookie 值
 * @param {Number} daysToExpire daysToExpire 天后过期
 * @param {String} cookiePath cookie 路径
 * @param {String} cookieDomain cookie 所在的域
 */
function setCookie(cookieName, cookieValue, daysToExpire, cookiePath, cookieDomain) {
	// #ifdef MP-WEIXIN
    uni.setStorageSync(cookieName, cookieValue)
	// #endif
	
	// #ifndef MP-WEIXIN
	if (daysToExpire === void 0) { daysToExpire = 30; }
	if (cookiePath === void 0) { cookiePath = '/'; }
	if (cookieDomain === void 0) { cookieDomain = window.location.hostname; }
	var expires = '';
	if (daysToExpire) {
		var date = new Date();
		date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000);
		expires = "; expires=".concat(date.toUTCString());
	}
	document.cookie = "".concat(cookieName, "=").concat(cookieValue).concat(expires, "; path=").concat(cookiePath, "; domain=").concat(cookieDomain);
	// #endif
}

/**
 * @description 将大数字转化为万/亿的形式
 * @param {Number} num 待转化的数
 * @param {Object} opt 配置参数
 * @param {Number} opt.float 精度
 * @param {Boolean} opt.merge 返回结果是否与单位合并
 * @param {Array} opt.unit 单位配置
 * @returns {Array | String}
 */
function bigNumTransform(num, opt) {
    if (opt === void 0) { opt = {}; }
    var _a = opt.float, float = _a === void 0 ? 2 : _a, _b = opt.merge, merge = _b === void 0 ? true : _b, _c = opt.unit, unit = _c === void 0 ? ['万', '亿'] : _c;
    var NumberNum = Number(num);
    if (Number.isNaN(NumberNum))
        return merge ? 'NaN' : ['NaN', ''];
    var transNum = NumberNum;
    if (NumberNum < 0)
        transNum = 0 - NumberNum;
    var arr = transNum.toString().split('.');
    var length = arr[0].length;
    var result = arr[0];
    var resUnit = '';
    if (length < 5) { // 0 - 9,999
        result = transNum.toFixed(float);
    }
    else if (length >= 5 && length <= 8) { // 10,000 - 99,999,999
        resUnit = unit[0];
        result = (transNum / 10000).toFixed(float);
    }
    else {
        resUnit = unit[1];
        result = (transNum / 100000000).toFixed(float);
    }
    // 进位处理
    if (Number(result) >= 10000) {
        result = (Number(result) / 10000).toFixed(float);
        if (resUnit === '') {
            resUnit = unit[0];
        }
        else if (resUnit === unit[0]) {
            resUnit = unit[1];
        }
    }
    if (NumberNum < 0)
        result = "-".concat(result);
    return merge ? "".concat(result).concat(resUnit) : [result, resUnit];
}

/**
 * @description 计算输入日期num天(月)之后的日期
 * @param {Number | String | Date} inputDate 日期，20201011、'2020-10-11'、'2020/10/11'、new Date('2020-10-11')
 * @param {Number} num 天数(月数)
 * @param {String} fmt 返回的日期格式
 * @return {string} num天(月)之后的日期
 */
function calculateDate(inputDate, num, fmt) {
    var date = toDate(inputDate);
    var str = inputDate.toString();
    if (isVaildDate(date) && str.length > 7) {
        date.setTime(date.getTime() + num * 24 * 3600 * 1000);
        return dateFormat(date, fmt);
    }
    if (toMonth(inputDate)) {
        // 月份计算
        var _a = toMonth(inputDate).split('-'), yearStr = _a[0], monthStr = _a[1];
        var year = parseInt(yearStr, 10);
        var month = parseInt(monthStr, 10);
        var futureDate = new Date(year, month - 1);
        futureDate.setMonth(futureDate.getMonth() + num);
        var futureYear = futureDate.getFullYear();
        var futureMonth = futureDate.getMonth() + 1;
        var paddedMonth = futureMonth < 10 ? "0".concat(futureMonth) : "".concat(futureMonth);
        return "".concat(futureYear, "-").concat(paddedMonth);
    }
    return '';
}

/**
 * @description 截取两个特征字符串之间的内容
 * @param {String} str 被截取的字符串
 * @param {String} startSymbol 起始特征字符串
 * @param {String} endSymbol 终止特征字符串
 * @param {Object} opt 参数配置
 * @param {Boolean} opt.greedyMode 是否开启贪婪模式，默认关闭，返回结果中将包含最大匹配长度的字符串
 * @param {Boolean} opt.global 是否开启全局匹配，默认关闭，开启后将返回所有两个特征字符串之间的内容数组
 * @return {String | Array} 两个特征字符串之间的内容
 */
function extractStr(str, startSymbol, endSymbol, opt) {
    if (opt === void 0) { opt = {}; }
    var _a = opt.greedyMode, greedyMode = _a === void 0 ? false : _a, _b = opt.global, global = _b === void 0 ? false : _b;
    if (!endSymbol && !startSymbol) {
        var globalRes = str ? [str] : [];
        return global ? globalRes : str;
    }
    else if (!endSymbol) { // endSymbol为空，不考虑贪婪模式
        var resArr = [];
        var resIndex = str.indexOf(startSymbol, 0);
        if (resIndex === -1)
            return global ? [] : '';
        if (!global)
            return str.slice(resIndex + 1);
        while (resIndex !== -1) {
            resArr.push(str.slice(resIndex + 1));
            resIndex = str.indexOf(startSymbol, resIndex + 1);
        }
        return resArr;
    }
    else if (!startSymbol) { // startSymbol为空
        var resArr = [];
        var resIndex = str.indexOf(endSymbol, 0);
        if (resIndex === -1)
            return global ? [] : '';
        if (!global && !greedyMode)
            return str.slice(0, resIndex);
        if (global && !greedyMode)
            return [str.slice(0, resIndex)];
        while (resIndex !== -1) { // 贪婪全匹配
            resArr.push(str.slice(0, resIndex));
            resIndex = str.indexOf(endSymbol, resIndex + 1);
        }
        // 贪婪非全匹配
        if (!global && greedyMode)
            return resArr[resArr.length - 1];
        return resArr;
    }
    var pattern;
    var greedyExp = "(?<=".concat(startSymbol, ")(.*)(?=").concat(endSymbol, ")");
    var notGreedyExp = "(?<=".concat(startSymbol, ")(.*?)(?=").concat(endSymbol, ")");
    if (greedyMode) {
        pattern = new RegExp(greedyExp);
    }
    else {
        pattern = new RegExp(notGreedyExp, global ? 'g' : '');
    }
    var matches = str.match(pattern);
    if (!matches)
        return global ? [] : '';
    if (greedyMode && global) { // 贪婪全匹配
        var globalMatches = str.match(new RegExp(notGreedyExp, 'g'));
        return globalMatches.concat(matches[0]);
    }
    // 非贪婪的全匹配
    if (!greedyMode && global)
        return matches;
    // 非全匹配，返回字符串
    return matches[0];
}

/**
 * @description 获取两个日期的间隔时间
 * @param {*} startDate 开始日期
 * @param {*} endDate 结束日期
 * @param {Object} opt 配置选项
 * @param {String} opt.format d、h、m、s、ms
 * @returns {number} 间隔毫秒数(天、时、分、秒)
 */
function dateInterval(startDate, endDate, opt) {
    if (opt === void 0) { opt = {}; }
    var diffdate = 0;
    var sTime = toDate(startDate);
    var eTime = toDate(endDate);
    var _a = opt.format, format = _a === void 0 ? 'ms' : _a;
    if (isVaildDate(sTime) && isVaildDate(eTime)) {
        diffdate = sTime.getTime() - eTime.getTime();
        switch (format) {
            case 's':
                diffdate /= 1000;
                break;
            case 'm':
                diffdate = diffdate / 1000 / 60;
                break;
            case 'h':
                diffdate = diffdate / 1000 / 60 / 60;
                break;
            case 'd':
                diffdate = diffdate / 1000 / 60 / 60 / 24;
                break;
        }
    }
    else {
        return NaN;
    }
    return diffdate;
}

/**
 * @description 提取字符串中的数字
 * @param {String} str 待提取的字符串
 * @param {String} allowNegative 是否将 - 作为负号识别
 * @return {Array} 数字
 */
function extractNumbers(str, allowNegative) {
    if (allowNegative === void 0) { allowNegative = false; }
    var regex = allowNegative ? /-?\d+(\.\d+)?/g : /\d+(\.\d+)?/g;
    var matches = str.match(regex);
    if (matches) {
        return matches.map(function (match) { return parseFloat(match); });
    }
    else {
        return [];
    }
}

export { getCookieFromStr, bigNumTransform, calculateDate, dateFormat, dateGap, dateInterval, debounce, deepClone, delCookie, extractNumbers, extractStr, getCookie, getUrlParams, isObject, isVaildDate, setCookie, sortCallback, throttle, toDate, toMonth };
