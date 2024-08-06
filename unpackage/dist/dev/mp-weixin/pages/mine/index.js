"use strict";
const common_vendor = require("../../common/vendor.js");
const request_api_index = require("../../request.api/index.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  (_easycom_uni_icons2 + _easycom_uni_card2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_card = () => "../../uni_modules/uni-card/components/uni-card/uni-card.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_card)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const store = new common_vendor.useStore();
    const isLogin = common_vendor.computed(() => store.getters["app/isLogin"]);
    const USER_INFO = common_vendor.computed(() => store.state.app.USER_INFO);
    const avatarImg = common_vendor.computed(() => {
      const { avatar } = USER_INFO.value;
      if (avatar) {
        return request_api_index.baseUrl + avatar;
      }
      return "";
    });
    const setLoginDrawerStatus = (status) => store.commit("app/setLoginDrawerStatus", status);
    const logoutAction = () => store.dispatch("app/logoutAction");
    const login = () => {
      setLoginDrawerStatus(true);
    };
    const logout = () => {
      logoutAction();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: isLogin.value
      }, isLogin.value ? common_vendor.e({
        b: avatarImg.value
      }, avatarImg.value ? {
        c: avatarImg.value
      } : {}, {
        d: common_vendor.p({
          color: "#656565",
          type: "person-filled",
          size: "30"
        }),
        e: common_vendor.t(USER_INFO.value.userId)
      }) : {
        f: common_vendor.p({
          color: "#656565",
          type: "person-filled",
          size: "30"
        }),
        g: common_vendor.o(login)
      }, {
        h: common_vendor.p({
          margin: "10px 0"
        }),
        i: common_vendor.p({
          margin: "10px 0"
        }),
        j: isLogin.value
      }, isLogin.value ? {
        k: common_vendor.o(logout)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-569e925a"]]);
wx.createPage(MiniProgramPage);
