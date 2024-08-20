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

export {
	dateFormat,
}
