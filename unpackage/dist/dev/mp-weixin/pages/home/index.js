"use strict";
const common_vendor = require("../../common/vendor.js");
const request_api_index = require("../../request.api/index.js");
const pages_home_option = require("./option.js");
const utils_umob = require("../../utils/umob.js");
if (!Array) {
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_data_picker2 = common_vendor.resolveComponent("uni-data-picker");
  const _easycom_uni_number_box2 = common_vendor.resolveComponent("uni-number-box");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _easycom_l_echart2 = common_vendor.resolveComponent("l-echart");
  (_easycom_uni_datetime_picker2 + _easycom_uni_forms_item2 + _easycom_uni_data_picker2 + _easycom_uni_number_box2 + _easycom_uni_forms2 + _easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_table2 + _easycom_l_echart2)();
}
const _easycom_uni_datetime_picker = () => "../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_data_picker = () => "../../uni_modules/uni-data-picker/components/uni-data-picker/uni-data-picker.js";
const _easycom_uni_number_box = () => "../../uni_modules/uni-number-box/components/uni-number-box/uni-number-box.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
const _easycom_uni_th = () => "../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_table = () => "../../uni_modules/uni-table/components/uni-table/uni-table.js";
const _easycom_l_echart = () => "../../uni_modules/lime-echart/components/l-echart/l-echart.js";
if (!Math) {
  (_easycom_uni_datetime_picker + _easycom_uni_forms_item + _easycom_uni_data_picker + _easycom_uni_number_box + _easycom_uni_forms + _easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_table + _easycom_l_echart)();
}
const futuresNum = 6;
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const echarts = require("../../uni_modules/lime-echart/static/echarts.min");
    const chartRef = common_vendor.ref(null);
    const date = /* @__PURE__ */ new Date();
    const store = new common_vendor.useStore();
    const ruleFormRef = common_vendor.ref();
    common_vendor.ref();
    const recentlyFeatureNames = common_vendor.ref([]);
    const formData = common_vendor.reactive({
      date,
      name: "",
      buyOrSale: 0,
      openOrClose: 0,
      hands: 0,
      price: 0
    });
    const rules = common_vendor.reactive({
      date: { rules: [{ required: true, errorMessage: "请选择日期", trigger: "change" }] },
      name: { rules: [{ required: true, message: "请选择合约", trigger: "change" }] },
      hands: { rules: [
        { required: true, message: "请输入手数", trigger: "change" },
        { validateFunction: function(rule, value, data, callback) {
          if (value <= 0) {
            callback("请输入手数");
          }
          return true;
        } }
      ] },
      price: { rules: [
        { required: true, message: "请输入成交价", trigger: "change" },
        { validateFunction: function(rule, value, data, callback) {
          if (value <= 0) {
            callback("请输入成交价");
          }
          return true;
        } }
      ] }
    });
    const futuresList = common_vendor.computed(() => store.getters["order/futuresList"]);
    const isLogin = common_vendor.computed(() => store.getters["app/isLogin"]);
    common_vendor.computed(() => store.getters["app/overMediaCritical"]);
    const openingOrderList = common_vendor.computed(() => store.state.order.openingOrderList);
    const openingOrderGroup = common_vendor.computed(() => store.state.order.openingOrderGroup);
    const setLoginDrawerStatus = (status) => store.commit("app/setLoginDrawerStatus", status);
    const setOpeningOrderList = (value) => store.commit("order/setOpeningOrderList", value);
    const getOpeningOrderData = () => store.dispatch("order/getOpeningOrderData");
    const futuresConfigList = common_vendor.computed(() => {
      const list = [];
      const dateList = [];
      let year = Number(utils_umob.dateFormat(date, "yy"));
      let month = Number(utils_umob.dateFormat(date, "MM"));
      for (let i = 0; i < futuresNum; i++) {
        month++;
        if (month > 12) {
          year++;
          month = 1;
        }
        if (month < 10) {
          dateList.unshift(`${year}0${month}`);
        } else {
          dateList.unshift(`${year}${month}`);
        }
      }
      futuresList.value.forEach((item) => {
        list.push([]);
        dateList.forEach((cell) => {
          list[list.length - 1].unshift(`${item.name}${cell}`);
        });
      });
      return list;
    });
    const futuresTree = common_vendor.computed(() => {
      const list = [];
      const dateList = [];
      let year = Number(utils_umob.dateFormat(date, "yy"));
      let month = Number(utils_umob.dateFormat(date, "MM"));
      for (let i = 0; i < futuresNum; i++) {
        month++;
        if (month > 12) {
          year++;
          month = 1;
        }
        if (month < 10) {
          dateList.unshift(`${year}0${month}`);
        } else {
          dateList.unshift(`${year}${month}`);
        }
      }
      futuresList.value.forEach((item) => {
        const children = [];
        dateList.forEach((cell) => {
          children.push({
            text: cell,
            value: `${item.name}${cell}`
          });
        });
        list.push({
          text: item.name,
          value: item.name,
          children
        });
      });
      return list;
    });
    common_vendor.computed(() => {
      const obj = {};
      futuresList.value.forEach((item) => {
        obj[item.name.toLowerCase()] = item.name;
      });
      return obj;
    });
    const buySaleListNum = common_vendor.computed(() => {
      const buyList = openingOrderList.value.filter((item) => item.buyOrSale === 1 && formData.name === item.name);
      const saleList = openingOrderList.value.filter((item) => item.buyOrSale === 0 && formData.name === item.name);
      return {
        buyListNum: buyList.length,
        // 多单列表为空
        saleListNum: saleList.length
      };
    });
    const submitHandle = async (buyOrSale, openOrClose) => {
      if (!isLogin.value) {
        setLoginDrawerStatus(true);
      } else {
        const valid = await ruleFormRef.value.validate().catch((e) => {
        });
        if (!valid)
          return;
        formData.buyOrSale = buyOrSale;
        formData.openOrClose = openOrClose;
        formData.date = utils_umob.dateFormat(formData.date, "yyyy-MM-dd hh:mm:ss");
        const data = await request_api_index.fetchInsertOrder(formData) || {};
        const { success } = data;
        if (success) {
          common_vendor.index.showToast({
            title: "操作成功",
            duration: 2e3,
            icon: "success"
          });
          rerenderTable();
          formData.hands = 0;
          formData.price = 0;
        }
      }
    };
    const getRecentlyFeature = async () => {
      const res = await request_api_index.fetchRecentlyFeature();
      recentlyFeatureNames.value = res.data || [];
      recentlyFeatureNames.value = recentlyFeatureNames.value.slice(0, 6);
    };
    const selectOrderName = (name) => {
      formData.name = name;
      common_vendor.index.setStorageSync("default-order-name", formData.name);
    };
    const selectOrderTree = (treeItem) => {
      const { detail = [] } = treeItem;
      formData.name = detail.value.map((item) => item.value).join("");
      common_vendor.index.setStorageSync("default-order-name", formData.name);
    };
    const orderRowClick = (row) => {
      formData.name = row.name;
      formData.hands = row.hands;
      common_vendor.index.setStorageSync("default-order-name", formData.name);
      renderRowPrice(row);
    };
    const renderRowPrice = async (row) => {
      const echartLists = {
        x: [],
        y: []
      };
      openingOrderGroup.value[`${row.name}${row.buyOrSale}`].forEach((item) => {
        for (let i = 0; i < item.hands; i++) {
          echartLists.y.push(item.price);
          echartLists.x.push(utils_umob.dateFormat(item.date, "MM.dd"));
        }
      });
      const myChart = await chartRef.value.init(echarts);
      myChart.setOption(pages_home_option.getOrderLineOption(echartLists));
    };
    const rerenderTable = async () => {
      await getOpeningOrderData();
    };
    const initOpeningAndRecentlyFeature = async () => {
      if (isLogin.value) {
        await getRecentlyFeature();
        await rerenderTable();
        if (openingOrderList.value[0]) {
          renderRowPrice(openingOrderList.value[0]);
        }
      }
    };
    common_vendor.watch(isLogin, async (value) => {
      if (value) {
        initOpeningAndRecentlyFeature();
      } else {
        setOpeningOrderList([]);
        recentlyFeatureNames.value = [];
      }
    });
    common_vendor.onMounted(async () => {
      await initOpeningAndRecentlyFeature();
      const defaultOrderName = common_vendor.index.getStorageSync("default-order-name");
      if (defaultOrderName) {
        formData.name = defaultOrderName;
      } else {
        formData.name = futuresConfigList.value[0] && futuresConfigList.value[0][0] || "";
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(($event) => formData.date = $event),
        b: common_vendor.p({
          type: "datetime",
          placeholder: "请选择日期",
          modelValue: formData.date
        }),
        c: common_vendor.p({
          required: true,
          label: "交易日期",
          name: "date"
        }),
        d: common_vendor.o(selectOrderTree),
        e: common_vendor.o(($event) => formData.name = $event),
        f: common_vendor.p({
          localdata: futuresTree.value,
          ["popup-title"]: "请选择合约",
          modelValue: formData.name
        }),
        g: common_vendor.p({
          required: true,
          label: "合约",
          name: "name"
        }),
        h: common_vendor.o(($event) => formData.price = $event),
        i: common_vendor.p({
          placeholder: "请输入成交价",
          modelValue: formData.price
        }),
        j: common_vendor.p({
          required: true,
          label: "成交价",
          name: "price"
        }),
        k: common_vendor.o(($event) => formData.hands = $event),
        l: common_vendor.p({
          placeholder: "请输入手数",
          modelValue: formData.hands
        }),
        m: common_vendor.p({
          required: true,
          label: "手数",
          name: "hands"
        }),
        n: common_vendor.sr(ruleFormRef, "4978fed5-0", {
          "k": "ruleFormRef"
        }),
        o: common_vendor.p({
          modelValue: formData,
          rules,
          ["label-width"]: "95px",
          ["label-position"]: "left"
        }),
        p: common_vendor.o(($event) => submitHandle(1, 1)),
        q: common_vendor.o(($event) => submitHandle(0, 1)),
        r: !buySaleListNum.value.buyListNum,
        s: common_vendor.o(($event) => submitHandle(0, 0)),
        t: !buySaleListNum.value.saleListNum,
        v: common_vendor.o(($event) => submitHandle(1, 0)),
        w: recentlyFeatureNames.value.length
      }, recentlyFeatureNames.value.length ? {
        x: common_vendor.f(recentlyFeatureNames.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: common_vendor.o(($event) => selectOrderName(item), item),
            c: item
          };
        })
      } : {}, {
        y: common_vendor.p({
          prop: "name",
          label: "合约",
          width: "70",
          fixed: "left"
        }),
        z: common_vendor.p({
          prop: "buyOrSale",
          width: "60",
          label: "多/空"
        }),
        A: common_vendor.p({
          prop: "price",
          minWidth: "90",
          label: "开仓均价"
        }),
        B: common_vendor.p({
          prop: "hands",
          label: "手数"
        }),
        C: common_vendor.p({
          prop: "commission",
          width: "120",
          label: "开仓总手续费"
        }),
        D: common_vendor.f(openingOrderList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: "4978fed5-17-" + i0 + "," + ("4978fed5-16-" + i0),
            c: common_vendor.t(item.buyOrSale ? "多" : "空"),
            d: common_vendor.s(item.buyOrSale ? {
              color: "#eb4436"
            } : {
              color: "#0e9d58"
            }),
            e: "4978fed5-18-" + i0 + "," + ("4978fed5-16-" + i0),
            f: common_vendor.t(item.price),
            g: "4978fed5-19-" + i0 + "," + ("4978fed5-16-" + i0),
            h: common_vendor.t(item.hands),
            i: "4978fed5-20-" + i0 + "," + ("4978fed5-16-" + i0),
            j: common_vendor.t(item.commission),
            k: "4978fed5-21-" + i0 + "," + ("4978fed5-16-" + i0),
            l: index,
            m: common_vendor.o(($event) => orderRowClick(item), index),
            n: "4978fed5-16-" + i0 + ",4978fed5-9"
          };
        }),
        E: common_vendor.p({
          border: true
        }),
        F: isLogin.value
      }, isLogin.value ? {
        G: common_vendor.sr(chartRef, "4978fed5-22", {
          "k": "chartRef"
        })
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4978fed5"]]);
wx.createPage(MiniProgramPage);
