"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_limeEchart_components_lEchart_canvas = require("./canvas.js");
const uni_modules_limeEchart_components_lEchart_utils = require("./utils.js");
const _sfc_main = {
  name: "lime-echart",
  props: {
    type: {
      type: String,
      default: "2d"
    },
    customStyle: String,
    isDisableScroll: Boolean,
    isClickable: {
      type: Boolean,
      default: true
    },
    enableHover: Boolean,
    beforeDelay: {
      type: Number,
      default: 30
    }
  },
  data() {
    return {
      use2dCanvas: true,
      ariaLabel: "图表",
      width: null,
      height: null,
      nodeWidth: null,
      nodeHeight: null,
      // canvasNode: null,
      config: {},
      inited: false,
      finished: false,
      file: "",
      platform: "",
      isPC: false,
      isDown: false,
      isOffscreenCanvas: false,
      offscreenWidth: 0,
      offscreenHeight: 0
    };
  },
  computed: {
    canvasId() {
      return `lime-echart${this._ && this._.uid || this._uid}`;
    },
    offscreenCanvasId() {
      return `${this.canvasId}_offscreen`;
    },
    offscreenStyle() {
      return `width:${this.offscreenWidth}px;height: ${this.offscreenHeight}px; position: fixed; left: 99999px; background: red`;
    },
    canvasStyle() {
      return this.width && this.height ? "width:" + this.width + "px;height:" + this.height + "px" : "";
    }
  },
  beforeUnmount() {
    this.clear();
    this.dispose();
  },
  created() {
    const { platform } = common_vendor.index.getSystemInfoSync();
    this.isPC = /windows/i.test(platform);
    this.use2dCanvas = this.type === "2d" && uni_modules_limeEchart_components_lEchart_utils.canIUseCanvas2d();
  },
  mounted() {
    this.$nextTick(() => {
      this.$emit("finished");
    });
  },
  methods: {
    setChart(callback) {
      if (!this.chart) {
        console.warn(`组件还未初始化，请先使用 init`);
        return;
      }
      if (typeof callback === "function" && this.chart) {
        callback(this.chart);
      }
    },
    setOption() {
      if (!this.chart || !this.chart.setOption) {
        console.warn(`组件还未初始化，请先使用 init`);
        return;
      }
      this.chart.setOption(...arguments);
    },
    showLoading() {
      if (this.chart) {
        this.chart.showLoading(...arguments);
      }
    },
    hideLoading() {
      if (this.chart) {
        this.chart.hideLoading();
      }
    },
    clear() {
      if (this.chart) {
        this.chart.clear();
      }
    },
    dispose() {
      if (this.chart) {
        this.chart.dispose();
      }
    },
    resize(size) {
      if (size && size.width && size.height) {
        this.height = size.height;
        this.width = size.width;
        if (this.chart) {
          this.chart.resize(size);
        }
      } else {
        this.$nextTick(() => {
          common_vendor.index.createSelectorQuery().in(this).select(`.lime-echart`).boundingClientRect().exec((res) => {
            if (res) {
              let { width, height } = res[0];
              this.width = width = width || 300;
              this.height = height = height || 300;
              this.chart.resize({ width, height });
            }
          });
        });
      }
    },
    canvasToTempFilePath(args = {}) {
      const { use2dCanvas, canvasId } = this;
      return new Promise((resolve, reject) => {
        const copyArgs = Object.assign({
          canvasId,
          success: resolve,
          fail: reject
        }, args);
        if (use2dCanvas) {
          delete copyArgs.canvasId;
          copyArgs.canvas = this.canvasNode;
        }
        common_vendor.index.canvasToTempFilePath(copyArgs, this);
      });
    },
    async init(echarts, ...args) {
      if (args && args.length == 0 && !echarts) {
        console.error("缺少参数：init(echarts, theme?:string, opts?: object, callback?: function)");
        return;
      }
      let theme = null, opts = {}, callback;
      Array.from(arguments).forEach((item) => {
        if (typeof item === "function") {
          callback = item;
        }
        if (["string"].includes(typeof item)) {
          theme = item;
        }
        if (typeof item === "object") {
          opts = item;
        }
      });
      if (this.beforeDelay) {
        await uni_modules_limeEchart_components_lEchart_utils.sleep(this.beforeDelay);
      }
      let config = await this.getContext();
      uni_modules_limeEchart_components_lEchart_canvas.setCanvasCreator(echarts, config);
      try {
        this.chart = echarts.init(config.canvas, theme, Object.assign({}, config, opts));
        if (typeof callback === "function") {
          callback(this.chart);
        } else {
          return this.chart;
        }
      } catch (e) {
        console.error(e.messges);
        return null;
      }
    },
    getContext() {
      return uni_modules_limeEchart_components_lEchart_utils.getRect(`#${this.canvasId}`, { context: this, type: this.use2dCanvas ? "fields" : "boundingClientRect" }).then((res) => {
        if (res) {
          let dpr = uni_modules_limeEchart_components_lEchart_utils.devicePixelRatio;
          let { width, height, node } = res;
          let canvas;
          this.width = width = width || 300;
          this.height = height = height || 300;
          if (node) {
            const ctx = node.getContext("2d");
            canvas = new uni_modules_limeEchart_components_lEchart_canvas.Canvas(ctx, this, true, node);
            this.canvasNode = node;
          } else {
            dpr = this.isPC ? uni_modules_limeEchart_components_lEchart_utils.devicePixelRatio : 1;
            this.rect = res;
            this.nodeWidth = width * dpr;
            this.nodeHeight = height * dpr;
            const ctx = common_vendor.index.createCanvasContext(this.canvasId, this);
            canvas = new uni_modules_limeEchart_components_lEchart_canvas.Canvas(ctx, this, false);
          }
          return { canvas, width, height, devicePixelRatio: dpr, node };
        } else {
          return {};
        }
      });
    },
    getRelative(e, touches) {
      let { clientX, clientY } = e;
      if (!(clientX && clientY) && touches && touches[0]) {
        clientX = touches[0].clientX;
        clientY = touches[0].clientY;
      }
      return { x: clientX - this.rect.left, y: clientY - this.rect.top, wheelDelta: e.wheelDelta || 0 };
    },
    getTouch(e, touches) {
      const { x } = touches && touches[0] || {};
      return x ? touches[0] : this.getRelative(e, touches);
    },
    touchStart(e) {
      this.isDown = true;
      const next = () => {
        const touches = uni_modules_limeEchart_components_lEchart_utils.convertTouchesToArray(e.touches);
        if (this.chart) {
          const touch = this.getTouch(e, touches);
          this.startX = touch.x;
          this.startY = touch.y;
          this.startT = /* @__PURE__ */ new Date();
          const handler = this.chart.getZr().handler;
          uni_modules_limeEchart_components_lEchart_canvas.dispatch.call(handler, "mousedown", touch);
          uni_modules_limeEchart_components_lEchart_canvas.dispatch.call(handler, "mousemove", touch);
          handler.processGesture(uni_modules_limeEchart_components_lEchart_utils.wrapTouch(e), "start");
          clearTimeout(this.endTimer);
        }
      };
      if (this.isPC) {
        uni_modules_limeEchart_components_lEchart_utils.getRect(`#${this.canvasId}`, { context: this }).then((res) => {
          this.rect = res;
          next();
        });
        return;
      }
      next();
    },
    touchMove(e) {
      if (this.isPC && this.enableHover && !this.isDown) {
        this.isDown = true;
      }
      const touches = uni_modules_limeEchart_components_lEchart_utils.convertTouchesToArray(e.touches);
      if (this.chart && this.isDown) {
        const handler = this.chart.getZr().handler;
        uni_modules_limeEchart_components_lEchart_canvas.dispatch.call(handler, "mousemove", this.getTouch(e, touches));
        handler.processGesture(uni_modules_limeEchart_components_lEchart_utils.wrapTouch(e), "change");
      }
    },
    touchEnd(e) {
      this.isDown = false;
      if (this.chart) {
        const touches = uni_modules_limeEchart_components_lEchart_utils.convertTouchesToArray(e.changedTouches);
        const { x } = touches && touches[0] || {};
        const touch = (x ? touches[0] : this.getRelative(e, touches)) || {};
        const handler = this.chart.getZr().handler;
        const isClick = Math.abs(touch.x - this.startX) < 10 && /* @__PURE__ */ new Date() - this.startT < 200;
        uni_modules_limeEchart_components_lEchart_canvas.dispatch.call(handler, "mouseup", touch);
        handler.processGesture(uni_modules_limeEchart_components_lEchart_utils.wrapTouch(e), "end");
        if (isClick) {
          uni_modules_limeEchart_components_lEchart_canvas.dispatch.call(handler, "click", touch);
        } else {
          this.endTimer = setTimeout(() => {
            uni_modules_limeEchart_components_lEchart_canvas.dispatch.call(handler, "mousemove", { x: 999999999, y: 999999999 });
            uni_modules_limeEchart_components_lEchart_canvas.dispatch.call(handler, "mouseup", { x: 999999999, y: 999999999 });
          }, 50);
        }
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $options.canvasId
  }, $options.canvasId ? common_vendor.e({
    b: $data.use2dCanvas
  }, $data.use2dCanvas ? {
    c: $options.canvasId,
    d: common_vendor.s($options.canvasStyle),
    e: $props.isDisableScroll,
    f: common_vendor.o((...args) => $options.touchStart && $options.touchStart(...args)),
    g: common_vendor.o((...args) => $options.touchMove && $options.touchMove(...args)),
    h: common_vendor.o((...args) => $options.touchEnd && $options.touchEnd(...args))
  } : {
    i: $data.nodeWidth,
    j: $data.nodeHeight,
    k: common_vendor.s($options.canvasStyle),
    l: $options.canvasId,
    m: $options.canvasId,
    n: $props.isDisableScroll,
    o: common_vendor.o((...args) => $options.touchStart && $options.touchStart(...args)),
    p: common_vendor.o((...args) => $options.touchMove && $options.touchMove(...args)),
    q: common_vendor.o((...args) => $options.touchEnd && $options.touchEnd(...args))
  }, {
    r: $data.isPC
  }, $data.isPC ? {
    s: common_vendor.o((...args) => $options.touchStart && $options.touchStart(...args)),
    t: common_vendor.o((...args) => $options.touchMove && $options.touchMove(...args)),
    v: common_vendor.o((...args) => $options.touchEnd && $options.touchEnd(...args)),
    w: common_vendor.o((...args) => $options.touchStart && $options.touchStart(...args)),
    x: common_vendor.o((...args) => $options.touchMove && $options.touchMove(...args)),
    y: common_vendor.o((...args) => $options.touchEnd && $options.touchEnd(...args))
  } : {}, {
    z: $data.isOffscreenCanvas
  }, $data.isOffscreenCanvas ? {
    A: common_vendor.s($options.offscreenStyle),
    B: $options.offscreenCanvasId
  } : {}, {
    C: common_vendor.s($props.customStyle),
    D: $data.ariaLabel
  }) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
