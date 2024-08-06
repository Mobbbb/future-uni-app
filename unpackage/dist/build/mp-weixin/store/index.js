"use strict";const e=require("../common/vendor.js"),r=require("./app/index.js"),o=require("./order/index.js"),s=e.createStore({modules:{app:r.app,order:o.order}});exports.store=s;
