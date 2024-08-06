"use strict";
const common_vendor = require("../../common/vendor.js");
const request_api_index = require("../../request.api/index.js");
if (!Array) {
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  _easycom_uni_card2();
}
const _easycom_uni_card = () => "../../uni_modules/uni-card/components/uni-card/uni-card.js";
if (!Math) {
  _easycom_uni_card();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const store = new common_vendor.useStore();
    common_vendor.computed(() => store.getters["app/isLogin"]);
    const USER_INFO = common_vendor.computed(() => store.state.app.USER_INFO);
    common_vendor.computed(() => {
      const { avatar } = USER_INFO.value;
      if (avatar) {
        return request_api_index.baseUrl + avatar;
      }
      return "";
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          margin: "10px 0"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-17a44f9d"]]);
wx.createPage(MiniProgramPage);
