"use strict";
const common_vendor = require("../common/vendor.js");
function toDate(params) {
  if (params instanceof Date)
    return params;
  if (typeof params === "number")
    return new Date(params);
  var paramsDate = "";
  if (typeof params === "string")
    paramsDate = params;
  var dateRegex2 = /^(\d{4})(\D)?(\d{2})\2(\d{2})(\s(\d{2}):(\d{2}):(\d{2}))?$/;
  var match = paramsDate.match(dateRegex2) || [];
  var monthRegex = /^(\d{4})\D?(\d{2})$/;
  var monthMatch = paramsDate.match(monthRegex);
  var INVALID_DATE = /* @__PURE__ */ new Date("");
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
  } else if (monthMatch) {
    year = parseInt(monthMatch[1], 10);
    month = parseInt(monthMatch[2], 10) - 1;
  } else {
    return INVALID_DATE;
  }
  var date = new Date(year, month, day, hours, minutes, seconds);
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return INVALID_DATE;
  }
  return date;
}
function isVaildDate(variable) {
  return variable instanceof Date && !Number.isNaN(variable.getTime());
}
function dateFormat(argDate, argFmt) {
  if (argFmt === void 0) {
    argFmt = "yyyy-MM-dd";
  }
  var date = toDate(argDate);
  var fmt = argFmt;
  if (!isVaildDate(date))
    return "";
  var week = ["日", "一", "二", "三", "四", "五", "六"];
  var o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds(),
    w: date.getDay(),
    W: week[date.getDay()],
    T: "T"
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, String(date.getFullYear()).substr(4 - RegExp.$1.length));
  }
  Object.keys(o).forEach(function(k) {
    if (new RegExp("(".concat(k, ")")).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : "00".concat(o[k]).substr(String(o[k]).length));
    }
  });
  return fmt;
}
function isObject(variable) {
  return Object.prototype.toString.call(variable) === "[object Object]";
}
var dateRegex = /^(\d{4})?(\D)?(\d{2})(\D)?(\d{2})(\s(\d{2}):(\d{2}):(\d{2}))?$/;
function trans(a, b) {
  var compareA = 0;
  var compareB = 0;
  if (dateRegex.test(a) && dateRegex.test(b)) {
    return {
      compareA: a,
      compareB: b
    };
  }
  if (typeof a === "string")
    compareA = Number(a);
  if (typeof b === "string")
    compareB = Number(b);
  if (typeof a === "number")
    compareA = a;
  if (typeof b === "number")
    compareB = b;
  return {
    compareA,
    compareB
  };
}
function sortCallback(params) {
  if (params === void 0) {
    params = {};
  }
  var _a = params.type, type = _a === void 0 ? "desc" : _a, key = params.key;
  var isDesc = type === "desc";
  var errorNum = Infinity;
  if (isDesc)
    errorNum = -Infinity;
  function compareFn(a, b) {
    var _a2 = trans(a, b), compareA = _a2.compareA, compareB = _a2.compareB;
    if (a === null || typeof a === "undefined")
      compareA = errorNum;
    if (b === null || typeof b === "undefined")
      compareB = errorNum;
    if (key && isObject(a) && isObject(b)) {
      compareA = trans(a[key], b[key]).compareA;
      compareB = trans(a[key], b[key]).compareB;
      if (a[key] === null || typeof a[key] === "undefined")
        compareA = errorNum;
      if (b[key] === null || typeof b[key] === "undefined")
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
    } else if (compareB < compareA) {
      descExp = -1;
    }
    if (compareA > compareB) {
      ascExp = 1;
    } else if (compareA < compareB) {
      ascExp = -1;
    }
    return isDesc ? descExp : ascExp;
  }
  return compareFn;
}
function getCookie(name) {
  return common_vendor.index.getStorageSync(name);
}
function delCookie(name, domain) {
  common_vendor.index.removeStorageSync(name);
}
exports.dateFormat = dateFormat;
exports.delCookie = delCookie;
exports.getCookie = getCookie;
exports.sortCallback = sortCallback;
