/**导入其他路由配置 */
import centerRoute from "@/router/centerRoute.js";

/**
 * 定义主要入口的路由配置
 */
var indexRoute = [
  // 输入页面地址错误的路由路径配置
  {
    path: "*",
    redirect: "/404"
  },
  {
    path: "/",
    name: "index",
    component: resolve => require(["@/views/index/index.vue"], resolve),
    children: centerRoute
  },

  // {
  //   path: "/index",
  //   name: "index",
  //   component: resolve => require(["@/views/index/index.vue"], resolve),
  //   children: centerRoute
  // },
  // 登录页面路由
  {
    path: "/login",
    name: "login",
    component: resolve => require(["@/views/login/login.vue"], resolve)
  },
  // {
  //   path: "/demo",
  //   name: "demo",
  //   component: resolve => require(["@/views/errorPage/demo.vue"], resolve)
  // },

  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
  },
];

export default indexRoute;
