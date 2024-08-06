"use strict";
const common_vendor = require("../../../../common/vendor.js");
function compareVersion(v1, v2) {
  v1 = v1.split(".");
  v2 = v2.split(".");
  const len = Math.max(v1.length, v2.length);
  while (v1.length < len) {
    v1.push("0");
  }
  while (v2.length < len) {
    v2.push("0");
  }
  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i], 10);
    const num2 = parseInt(v2[i], 10);
    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }
  return 0;
}
const systemInfo = common_vendor.index.getSystemInfoSync();
function gte(version) {
  let {
    SDKVersion,
    platform
  } = systemInfo;
  return platform !== "mac" && compareVersion(SDKVersion, version) >= 0;
}
function canIUseCanvas2d() {
  return gte("2.9.0");
}
function convertTouchesToArray(touches) {
  if (Array.isArray(touches)) {
    return touches;
  }
  if (typeof touches === "object" && touches !== null) {
    return Object.values(touches);
  }
  return touches;
}
function wrapTouch(event) {
  for (let i = 0; i < event.touches.length; ++i) {
    const touch = event.touches[i];
    touch.offsetX = touch.x;
    touch.offsetY = touch.y;
  }
  return event;
}
const devicePixelRatio = common_vendor.index.getSystemInfoSync().pixelRatio;
function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
}
function getRect(selector, options = {}) {
  const typeDefault = "boundingClientRect";
  const {
    context,
    type = typeDefault
  } = options;
  return new Promise((resolve, reject) => {
    const dom = common_vendor.index.createSelectorQuery().in(context).select(selector);
    const result = (rect) => {
      if (rect) {
        resolve(rect);
      } else {
        reject();
      }
    };
    if (type == typeDefault) {
      dom[type](result).exec();
    } else {
      dom[type]({
        node: true,
        size: true,
        rect: true
      }, result).exec();
    }
  });
}
exports.canIUseCanvas2d = canIUseCanvas2d;
exports.convertTouchesToArray = convertTouchesToArray;
exports.devicePixelRatio = devicePixelRatio;
exports.getRect = getRect;
exports.sleep = sleep;
exports.wrapTouch = wrapTouch;
