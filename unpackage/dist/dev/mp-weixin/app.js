"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const store_index = require("./store/index.js");
if (!Math) {
  "./pages/home/index.js";
  "./pages/mine/index.js";
  "./pages/order/index.js";
  "./pages/analyse/index.js";
  "./pages/login/index.js";
}
const _sfc_main = {
  __name: "App",
  setup(__props) {
    const store = new common_vendor.useStore();
    const INIT_USER = (value) => store.dispatch("app/INIT_USER", value);
    const getFutureConfigInfo = () => store.dispatch("order/getFutureConfigInfo");
    common_vendor.onLaunch(() => {
      INIT_USER();
      getFutureConfigInfo();
    });
    common_vendor.onShow(() => {
    });
    common_vendor.onHide(() => {
    });
    return () => {
    };
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(store_index.store);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
