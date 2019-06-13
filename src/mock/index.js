import Mock from "mockjs";

//模拟菜单
Mock.mock("/iglms/menuItem/listMenuTree", "get", {
  "result|7": [
    {
      "id|+1000": 40000,
      entry: {
        "menuName|+1": [
          "组织架构管理",
          "农民工管理",
          "工资发放管理",
          "考勤管理",
          "查询统计",
          "申诉受理",
          "用户管理"
        ]
      },
      "location|+1": [
        "org",
        "contract",
        "wage",
        "user",
        "attendance",
        "inOut",
        "report"
      ]
    }
  ],
  code: "200",
});

//模拟组织机构管理
Mock.mock("/iglms/organization/findUbOrganization?page=1&pageSize=50", "get", {
  // Mock.mock('/iglms/organization/findUbOrganization?page=1&pageSize=50', 'get', {
  result: {
    "list|20": [
      {
        // 随机生成5到20个数组元素
        "orderNo|+1": 1,
        "mobile|1": /^1[0-9]{10}$/,
        userName: "@cname", // 中文名称
        "teamName|1": ["架子一队", "架子二队", "架子三队"],
        "orgStatus|1": ["在场", "不在场"]
      }
    ],
    total: 50
  },
  code: "200",
  message:"我故意失败的"
});

export default Mock;
