import Vue from "vue";
import Router from "vue-router";
import routes from "./routers";
import iView from "iview";
import utils from "@/assets/js/utils.js";


Vue.use(Router);
const router = new Router({
  routes,
});
const LOGIN_PAGE_NAME = "login";
const HOME = "home" //默认首页是home


router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  if (to.matched.length === 0) {
    next('/404'); //如果未匹配到路由
  } else {
    const token = utils.getItem("TOKEN_KEY");
    if (!token && to.name !== LOGIN_PAGE_NAME) {
      // 未登录且要跳转的页面不是登录页
      next({
        name: LOGIN_PAGE_NAME // 跳转到登录页
      });
    } else if (!token && to.name === LOGIN_PAGE_NAME) {
      // 未登陆且要跳转的页面是登录页
      next(); // 跳转
    } else if (token && (to.name === LOGIN_PAGE_NAME)) {
      // 已登录且要跳转的页面是登录页
      next({
        name: HOME // 跳转到homeName页
      });
    } else if (token && (to.name === "index")) {
      // 已登录且要跳转的页面是index页
      next({
        name: HOME // 跳转到homeName页
      });
    } else {
      next();
    }
  }

});

router.afterEach(to => {
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
});

export default router;
