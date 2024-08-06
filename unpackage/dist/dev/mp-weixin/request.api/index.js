"use strict";
const utils_request = require("../utils/request.js");
const prefixApi = "/api/future";
const baseUrl = "https://www.mobbbb.top";
let axios;
axios = new utils_request.HttpRequest(baseUrl);
const fetchUserLogin = (uid, password) => {
  return axios.request({
    url: prefixApi + "/user/login",
    method: "post",
    data: { uid, password }
  });
};
const fetchUserInfo = () => {
  return axios.request({
    url: prefixApi + "/user/info",
    method: "get"
  });
};
const fetchListData = () => {
  return axios.request({
    url: "/resource/future/message.json",
    method: "get"
  });
};
const fetchRecentlyFeature = () => {
  return axios.request({
    url: prefixApi + "/other/recentlyFeature",
    method: "get"
  });
};
const fetchOrderInfo = (params) => {
  return axios.request({
    url: prefixApi + "/other/orderInfo",
    method: "post",
    data: params
  });
};
const fetchOrderInfoHandle = async (params) => {
  const res = await fetchOrderInfo(params);
  const data = res.data || {};
  const { result = [], commission, profit, totalProfit, total } = data;
  return {
    commission,
    profit,
    totalProfit,
    total: total || 0,
    result
  };
};
const fetchInsertOrder = (params) => {
  return axios.request({
    url: prefixApi + "/other/insertOrder",
    method: "post",
    data: params
  });
};
const fetchFutureConfigInfo = () => {
  return axios.request({
    url: prefixApi + "/other/futureConfigInfo",
    method: "get"
  });
};
const fetchOpeningOrderInfo = () => {
  return axios.request({
    url: prefixApi + "/other/openingOrderInfo",
    method: "get"
  });
};
const fetchFutureDayShareInfo = (params) => {
  return axios.request({
    url: prefixApi + "/other/futureDayShareInfo",
    method: "post",
    data: params
  });
};
const fetchFutureDayLineInfo = (params) => {
  return axios.request({
    url: prefixApi + "/other/futureDayLineInfo",
    method: "post",
    data: params
  });
};
exports.baseUrl = baseUrl;
exports.fetchFutureConfigInfo = fetchFutureConfigInfo;
exports.fetchFutureDayLineInfo = fetchFutureDayLineInfo;
exports.fetchFutureDayShareInfo = fetchFutureDayShareInfo;
exports.fetchInsertOrder = fetchInsertOrder;
exports.fetchListData = fetchListData;
exports.fetchOpeningOrderInfo = fetchOpeningOrderInfo;
exports.fetchOrderInfoHandle = fetchOrderInfoHandle;
exports.fetchRecentlyFeature = fetchRecentlyFeature;
exports.fetchUserInfo = fetchUserInfo;
exports.fetchUserLogin = fetchUserLogin;
