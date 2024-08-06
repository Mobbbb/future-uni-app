"use strict";
const common_vendor = require("../common/vendor.js");
const store_app_index = require("./app/index.js");
const store_order_index = require("./order/index.js");
const store = common_vendor.createStore({
  // strict: process.env.NODE_ENV !== 'production',
  modules: {
    app: store_app_index.app,
    order: store_order_index.order
  }
});
const store$1 = store;
exports.store = store$1;
