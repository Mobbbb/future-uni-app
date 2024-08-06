"use strict";
const common_vendor = require("../../common/vendor.js");
const request_api_index = require("../../request.api/index.js");
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  (_easycom_uni_easyinput2 + _easycom_uni_card2)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_card = () => "../../uni_modules/uni-card/components/uni-card/uni-card.js";
if (!Math) {
  (_easycom_uni_easyinput + GcButton + _easycom_uni_card)();
}
const GcButton = () => "../../components/gc-button.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const store = new common_vendor.useStore();
    const username = common_vendor.ref("");
    const password = common_vendor.ref("");
    const saveLoginStatus = (value) => store.dispatch("app/saveLoginStatus", value);
    const INIT_USER = (value) => store.dispatch("app/INIT_USER", value);
    const isLogin = common_vendor.computed(() => store.getters["app/isLogin"]);
    const clickLogin = async () => {
      if (!username.value || !password.value) {
        common_vendor.index.showToast({
          title: "账号/密码不得为空",
          duration: 2e3
        });
      } else {
        const result = await request_api_index.fetchUserLogin(username.value, password.value);
        afterLoginSubmit(result);
      }
    };
    const afterLoginSubmit = async (result) => {
      const { data = {}, success, msg } = result;
      const cookies = result.cookies;
      common_vendor.index.showToast({
        title: msg,
        duration: 2e3,
        icon: success && cookies.length ? "success" : "error"
      });
      if (success && cookies.length) {
        data.cookies = cookies;
        saveLoginStatus(data);
        await INIT_USER();
        common_vendor.index.switchTab({
          url: "/pages/mine/index"
        });
      }
    };
    common_vendor.onMounted(() => {
      if (isLogin.value) {
        common_vendor.index.switchTab({
          url: "/pages/mine/index"
        });
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => username.value = $event),
        b: common_vendor.p({
          placeholder: "请输入账号",
          modelValue: username.value
        }),
        c: common_vendor.o(($event) => password.value = $event),
        d: common_vendor.p({
          type: "password",
          placeholder: "请输入密码",
          modelValue: password.value
        }),
        e: common_vendor.o(clickLogin),
        f: common_vendor.p({
          type: "active",
          width: "100%"
        }),
        g: common_vendor.p({
          padding: "24px 10px"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d08ef7d4"]]);
wx.createPage(MiniProgramPage);
