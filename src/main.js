import '@babel/polyfill'
import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";
import "./plugins/iview.js";
import axios from "axios";
import "./plugins/element.js";
import requestLink from "@/assets/js/requestLink.js";
import utils from "@/assets/js/utils.js";
import "@/assets/img/icons";
import qs from "qs";
import "@/assets/css/common.css"; // 使用 CSS

// 引入mockjs
// import "@/mock/index.js";


Vue.config.productionTip = process.env.NODE_ENV === 'production';
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;

/**
 * http过滤器 在请求的时候获取vuex中的authorization，并且设置在请求头中
 */
let sendCount = 0; //页面请求多次，则不再展示加载框
const CancelToken = axios.CancelToken;
const notAuth = (status) => {
  // 如果校验值是401，则证明登录失效，直接退出到登录页
  if (status === 401) {
    source.cancel();
    utils.removeItem("TOKEN_KEY");
     // 强制reload一次，让浏览器不要使用当前缓存js文件
    window.location.reload();
    window.location.href = "#/login";
    setTimeout(() => {
      source = CancelToken.source();
    }, 1000);
  }
}
let source = CancelToken.source();
axios.interceptors.request.use(
  config => {
    config.headers.Authorization = "";
    const Authorization = utils.getItem("TOKEN_KEY");
    // 将Authorization设置到请求的headers里
    config.headers.Authorization = Authorization;
    config.cancelToken = source.token;
    // 设置白名单,白名单内的接口可以不loadding直接通过,白名单设置可以在requestLink文件内设置
    var lastLink = config.url.split("/").slice(-1)[0],
      secondLink = config.url.split("/").slice(-2)[0];
    lastLink = (lastLink && lastLink.split("?")[0]) || "";
    secondLink = (secondLink && secondLink.split("?")[0]) || "";

    if (
      !requestLink.loadingWhiteList.includes(lastLink) &&
      !requestLink.loadingWhiteList.includes(secondLink)
    ) {
      utils.showLoadding(true);
    }
    sendCount++;
    return config;
  },
  error => {
    utils.showLoadding(false)
    return error;
  }
);
// http响应拦截器
axios.interceptors.response.use(
  response => {
    // 响应成功关闭loading
    sendCount--;
    if (sendCount <= 0) {
      utils.showLoadding(false)
    }
    // if (!data || data.error === "Unauthorized" || !data.ok) {
    //   window.location.href = "#/login";
    // }
    // 设置白名单,白名单内的接口响应内容可以不拦截直接返回，一般常用于后台下载文件返回二进制流文件
    const responseData = response.data;
    let lastLink = response.config.url.split("/").slice(-1)[0];
    lastLink = (lastLink && lastLink.split("?")[0]) || "";
    if ((requestLink.responseWhiteList.includes(lastLink))) {
      return responseData;
    }

    const codeList = ["200", "1044", "1045", "1046"];
    // 手机号、身份证号、银行卡号校验
    if (codeList.includes(responseData.code)) {
      return responseData;

    } else {
      const msg = responseData.message || "服务器异常，请稍后再试！"
      Vue.prototype.$Message.error(msg);
      notAuth(responseData.status)
      return false;
      // return Promise.reject(responseData)
    }
  },
  error => {
    sendCount--;
    const errorData = error.response.data;
    const msg = errorData.message || "服务器异常，请稍后再试！"
    Vue.prototype.$Message.error(msg);
    utils.showLoadding(false);
    // 如果后台返回 401 ，则证明token失效，后面请求不需要再继续发送，直接回到登录页
    notAuth(errorData.status)
    // return false;
    return Promise.reject(error)
  }
);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
