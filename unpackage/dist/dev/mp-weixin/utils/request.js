"use strict";
const common_vendor = require("../common/vendor.js");
const store_index = require("../store/index.js");
class HttpRequest {
  constructor(baseUrl = "") {
    this.baseUrl = baseUrl;
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      withCredentials: true,
      header: {
        "cookie": this.getCookies()
        // 获取当前所有 cookie
      }
    };
    return config;
  }
  getCookies() {
    return common_vendor.index.getStorageSync("future-token") || "";
  }
  request(options) {
    options = Object.assign(this.getInsideConfig(), options);
    return new Promise((resolve) => {
      common_vendor.index.request({
        method: options.method || "GET",
        url: options.baseURL + options.url || "",
        data: options.data || {},
        header: options.header || {},
        responseType: options.responseType || "text",
        success: (res) => {
          const resData = res.data || {};
          const cookies = res.cookies || [];
          const { data, success, msg, code } = resData;
          if (code === 403) {
            common_vendor.index.showToast({
              title: "登录已失效，请重新登录",
              duration: 2e3,
              icon: "error"
            });
            store_index.store.dispatch("app/logoutAction");
          } else if (success === false) {
            common_vendor.index.showToast({
              title: msg,
              duration: 2e3,
              icon: "error"
            });
          }
          resData.cookies = cookies;
          resolve(resData);
        },
        fail: (res) => {
          console.log(res);
        }
      });
    });
  }
}
exports.HttpRequest = HttpRequest;
