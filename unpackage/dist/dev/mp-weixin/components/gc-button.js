"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "gc-button",
  props: {
    color: {
      type: Object,
      default: () => {
        return {};
      }
    },
    width: {
      type: String,
      default: "71px"
    },
    icon: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ""
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const { width, disabled, type, loading } = common_vendor.toRefs(props);
    const style = common_vendor.computed(() => {
      return { width: width.value };
    });
    const formatDisabled = common_vendor.computed(() => {
      return disabled.value || loading.value;
    });
    const btnClass = common_vendor.computed(() => {
      let _class = formatDisabled.value ? "gc-button-disabled" : "";
      if (type.value) {
        _class += ` gc-button-${type.value}`;
      }
      return _class;
    });
    const clickHandle = () => {
      if (!formatDisabled.value) {
        emit("on-click");
      }
    };
    return {
      style,
      btnClass,
      clickHandle
    };
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.loading
  }, $props.loading ? {
    b: common_vendor.p({
      type: "spinner-cycle",
      size: "30"
    })
  } : {}, {
    c: common_vendor.n($setup.btnClass),
    d: common_vendor.s($setup.style),
    e: common_vendor.o((...args) => $setup.clickHandle && $setup.clickHandle(...args))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-81188b3a"]]);
wx.createComponent(Component);
