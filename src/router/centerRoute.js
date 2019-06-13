// 1000 农民工管理
// 1100 农民工基本信息管理
// 1200 进退场管理
// 1300 考勤管理
// 2000 工资管理
// 2100 架子队工资管理
// 2200 项目部工资管理
// 3000 综合管理
// 3100 组织机构管理
// 3200 劳务公司管理
// 3300 申诉处理
// 3400 用户管理
// 4000 综合查询
// 4100 人员综合查询
// 4200 合同查询
// 4300 进退场查询
// 4400 工资发放情况
// 4500 考勤查询
// 5000 我的信息 app
// 6000 我的工资  app
// 7000 我的合同 app
// 8000 我要申诉 app





const centerRoute = [{
    path: "/home",
    name: "home",
    component: resolve => require(["@/views/home/home.vue"], resolve),
  },
  {
    path: "/org",
    name: "3000",
    meta: {
      defaultActive: "3100", //用于给子菜单添加默认的class
    },
    component: resolve => require(['@/views/org/departMent/departMent.vue'], resolve),
  },
  {
    path: "/orgList",
    name: "3100",
    meta: {
      parentMenuId: "3000",
    },

    component: resolve => require(['@/views/org/departMent/departMent.vue'], resolve),
  },
  {
    path: "/labor", //劳务管理
    name: "3200",
    meta: {
      parentMenuId: "3000"
    },
    component: resolve => require(["@/views/org/labor/labor.vue"], resolve)
  },
  // 申诉处理
  {
    path: "/appeal",
    name: "3300",
    meta: {
      parentMenuId: '3000'
    },
    component: resolve => require(['@/views/appeal/appeal.vue'], resolve)
  },
    // 用户管理
    {
      path: "/user",
      name: "3400",
      meta: {
        parentMenuId: '3000'
      },
      component: resolve => require(["@/views/users/users.vue"], resolve)
    },

  // 农民工管理
  {
    path: "/workerManage",
    name: "1000",
    meta: {
      defaultActive: "1100"
    },
    component: resolve => require(["@/views/inOut/inOut.vue"], resolve)
  },
  // 人员
  {
    path: "/person",
    name: "1100",
    meta: {
      parentMenuId: "1000"
    },
    component: resolve => require(['@/views/person/personList.vue'], resolve)
  },
  {
    path: "/person/:id",
    name: "personView",
    component: resolve => require(['@/views/person/personView/personView.vue'], resolve)
  },
  {
    path: "/inOut",
    name: "1200",
    meta: {
      parentMenuId: "1000"
    },
    component: resolve => require(["@/views/inOut/inOut.vue"], resolve)
  },
  {
    path: "/attendance",
    name: "1300",
    meta: {
      parentMenuId: '1000'
    },
    component: resolve => require(['@/views/attendance/attendance.vue'], resolve)
  },

  //  工资
  {
    path: "/wage",
    name: "2000",
    meta: {
      defaultActive: "2100", //用于给子菜单添加默认的class
    },
    component: resolve => require(['@/views/wage/wagePlan/wagePlan.vue'], resolve)
  },
  {
    path: "/wage/wageBatch",
    name: "2200",
    meta: {
      parentMenuId: "2000",
    },
    component: resolve => require(['@/views/wage/wageBatch/wageBatch.vue'], resolve)
  },
  {
    path: "/wage/wagePlan",
    name: "2100",
    meta: {
      parentMenuId: "2000",
    },
    component: resolve => require(['@/views/wage/wagePlan/wagePlan.vue'], resolve)
  },
  {
    path: "/wage/wageManage/:id",
    name: "wageManage",
    component: resolve => require(['@/views/wage/wageManage/wageManage.vue'], resolve)
  },


  // 综合查询

  {
    path: "/query",
    name: "4000",
    meta: {
      defaultActive: "4100", //用于给子菜单添加默认的class
    },
    component: resolve => require(['@/views/query/person/index.vue'], resolve)
  },
  {
    path: "/query/personQuery",
    name: "4100",
    meta: {
      parentMenuId: "4000", //用于给子菜单添加默认的class
    },
    component: resolve => require(['@/views/query/person/index.vue'], resolve)
  },
  {
    path: "/query/contractQuery",
    name: "4200",
    meta: {
      parentMenuId: "4000",
    },
    component: resolve => require(["@/views/query/contractQuery/contractQuery.vue"], resolve)
  },
  {
    path: "/query/inOutQuery",
    name: "4300",
    meta: {
      parentMenuId: "4000",
    },
    component: resolve => require(["@/views/query/inOutQuery/inOutQuery.vue"], resolve)
  },

  {
    path: "/query/wageQuery",
    name: "4400",
    meta: {
      parentMenuId: "4000", //用于给子菜单添加默认的class
    },
    component: resolve => require(['@/views/query/wage/index.vue'], resolve)
  },
  {
    path: "/query/attendanceQuery",
    name: "4500",
    meta: {
      parentMenuId: "4000",
    },
    component: resolve => require(["@/views/query/attendanceQuery/attendanceQuery.vue"], resolve)
  },
  {
    path: "/query/attendanceSummary",
    name: "4600",
    meta: {
      parentMenuId: "4000",
    },
    component: resolve => require(["@/views/query/attendanceSummary/attendanceSummary.vue"], resolve)
  }
];

export default centerRoute;
