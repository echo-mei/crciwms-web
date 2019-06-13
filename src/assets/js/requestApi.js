/**
 * 所有模块调用接口配置
 */

const BASE_URL = `/crciwms`;
export default {

  /**
   * 首页相关接口
   */

  getNotContractCount: `${BASE_URL}/person/getNotContractCount`, //人员合同不全数量
  getNotImageCount: `${BASE_URL}/person/getNotImageCount`, //人员证照不全数量
  getPersonStatisticsInfo: `${BASE_URL}/person/getPersonStatisticsInfo`, //人员分部汇总
  getWaitPaidWageCount: `${BASE_URL}/wageBatch/getNotCompletedWageBatchCount`, //项目部、项目分部：工资待发放数量
  getJzdWaitPaidWageCount: `${BASE_URL}/wagePlan/getNotCompletedWagePlanCount`, //架子队：工资待发放数量
  getAppealInfoTotal: `${BASE_URL}/appeal/getAppealInfoTotal`, //申诉处理数量

  /**
   * 登录相关接口
   */

  login: `${BASE_URL}/base/base/login`, // 登录
  getRSAPublicKey: `${BASE_URL}/base/base/getRSAPublicKey`, // 获取RSA私钥
  getMenu: `${BASE_URL}/base/menuItem/listMenuTree`, //获取菜单
  getVersionNumber: `${BASE_URL}/base/base/getVersionNumber`, //获取菜单



  /**
   * 机构管理接口
   */
  orgList: `${BASE_URL}/organization/listOrganizationInfo`, // 按条件查询所有组织机构表
  orgTreeList: `${BASE_URL}/organization/listOrganizationTree`, // 查询所有机构树
  todoOrg: `${BASE_URL}/organization`, //新增、编辑、删除组织架构
  getOrgType: `${BASE_URL}/organization/getOrganizationType`, //获取组织架构类型
  /**
   * 人员管理接口
   */
  personList: "/crciwms/person/listPersonInfo", //人员列表
  salaryListByPersonOid: "/crciwms/wageBase/listWageBase", //获取某人的工资列表
  /**
   * 工资管理
   */
  wagePlanList: `${BASE_URL}/wagePlan/listWagePlanInfo`, // 按条件查询所有工资计划列表
  wageBatchList: `${BASE_URL}/wageBatch/listWageBatchInfo`, // 按条件查询所有工资批次列表
  wageBatch: `${BASE_URL}/wageBatch`, // 新增、编辑、删除批次
  wagePlan: `${BASE_URL}/wagePlan`, // 新增、编辑、删除计划
  writeWageBaseExcel: `${BASE_URL}/wagePlan/writeWageBaseExcel`, // 上传工资
  submitWagePlan: `${BASE_URL}/wagePlan/submitWagePlan`, // 提交工资发放计划申请
  recallWagePlan: `${BASE_URL}/wagePlan/recallWagePlan`, // 撤回工资发放计划申请
  exportWageExcel: `${BASE_URL}/wageBatch/exportWageExcel`, // 生成银行发放工资表
  listWagePlanByBatchOid: `${BASE_URL}/wagePlan/listWagePlanByBatchOid`, // 根据批次OID获取计划信息
  downloadBankBill: `${BASE_URL}/wageBatch/downloadBankBill`, // 下载银行回执单
  uploadBankBill: `${BASE_URL}/wageBatch/uploadBankBill`, // 上传银行发放工资回执
  deleteFromWageBatch: `${BASE_URL}/wagePlan/deleteFromWageBatch`, // 移除发放批次
  listWaitWagePlan: `${BASE_URL}/wagePlan/listWaitWagePlan`, // 获取待添加至发放批次中的计划信息
  insertIntoWageBatch: `${BASE_URL}/wagePlan/insertIntoWageBatch`, // 添加至发放批次中
  confirmWageBatch: `${BASE_URL}/wageBatch/confirmWageBatch`, // 确认发放批次
  cancelWageBatch: `${BASE_URL}/wageBatch/cancelWageBatch`, // 取消确认发放批次
  completedWageBatch: `${BASE_URL}/wageBatch/completedWageBatch`, // 完成发放批次
  listWageBase: `${BASE_URL}/wageBase/listWageBase`, // 获取人员工资信息
  uploadWageConfirmPDF: `${BASE_URL}/wagePlan/uploadWageConfirmPDF`, // 上传工资确认表
  exportWageBaseConfirmPDF: `${BASE_URL}/wagePlan/exportWageBaseConfirmPDF`, // 导出工资确认表
  listWageConfirmPDF: `${BASE_URL}/wagePlan/listWageConfirmPDF`, // 查看工资确认表附件列表
  wagePlanDetail: `${BASE_URL}/wagePlan/wagePlanDetail`, // 删除工资确认表附件列表
  downloadWageConfirmPDF: `${BASE_URL}/wagePlan/downloadWageConfirmPDF`, // 下载工资确认表附件列表
  deleteWage: `${BASE_URL}/wageBase`, // 删除工资信息
  listWageGeneralInfo: `${BASE_URL}/wageBase/listWageGeneralInfo`, // 工资发放信息查询
  exportWageGeneralInfo: `${BASE_URL}/wageBase/exportWageGeneralInfo`, // 导出工资发放信息
  listWageBatchInfoAll: `${BASE_URL}/wageBatch/listWageBatchInfoAll`, // 查询所有发放批次信息
  listWagePlanInfoAll: `${BASE_URL}/wagePlan/listWagePlanInfoAll`, // 查询所有发放计划信息




  /**
   * 获取图片
   */
  upload: `/iglms/upload`,

  /**
   * 获取用户头像
   */

  getPhoto: `/iglms/personInfo/getPhoto`,
  /**
   * 进退场管理
   */
  getOrg: "/crciwms/organization/listOrganizationByParentUnitOid", //获取组织架构上下级信息
  getTableList: "/crciwms/person/listPersonInfo", //获取人员列表信息
  inOrg: "/crciwms/transfer/createTransferEnter", //进场
  outOrg: "/crciwms/transfer/createTransferExit", //退场
  /**
   * 劳务公司管理*
   */
  createLabor: "/crciwms/company", //创劳务公司
  listCompanyInfo: "/crciwms/company/listCompanyInfo", //列出劳务公司信息
  checkCompany: "/crciwms/company/checkCompany", //校验统一社会信用代码
  addCompany: "/crciwms/company", //创建劳务公司
  updateCompany: "/crciwms/company", //更新劳务公司
  deleteCompany: "/crciwms/company", //删除劳务公司
  getCompany: "/crciwms/company", //获取劳务公司
  exportWageCompanyList: `${BASE_URL}/company/listCompanyInfoForExportWage`, //列出可导出工资确认表的劳务公司清单
  importWageCompanyList: `${BASE_URL}/company/listCompanyInfoForImportWage`, // 列出可导入工资信息的劳务公司清单

  /**
   * 用户管理
   */
  listUsers: "/crciwms/base/users/listUsersInfo", //获取用户列表信息
  getListOrg: "/crciwms/organization/listOrganizationInfo", //获取组织机构信息
  createUser: "/crciwms/base/users", //创建用户信息
  accountNoCheck: "/crciwms/base/users/checkAccountNo", //校验登录账号的唯一性
  getUser: "/crciwms/base/users", //获取选择的用户信息
  updateUser: "/crciwms/base/users", //更新用户信息
  deleteUsers: "/crciwms/base/users/deleteUsers", //删除用户信息
  updatePass: "/crciwms/base/users/updateUsersPassword", //密码更新
  resetPass: "/crciwms/base/users/resetPassWord", //密码重置
  getUserInfo: "/crciwms/base/users/findByUserCode", //获取用户人员关系
  /**
   * 考勤管理
   */
  getUnitOid: "/crciwms/organization/listOrganizationInfo", //获取架子队,项目分部，班组
  getlistAttenceInfo: "/crciwms/attence/listAttenceInfo", //获取考勤管理信息列表
  importAtt: "/crciwms/attence/writeAttenceExcel", //考勤记录导入
  scannAtt: "/crciwms/attence/uploadAttencePDF", //考勤扫描件上传
  downScann: "/crciwms/attence/listAttencePDF", //考勤扫描件下载
  getAnnexList: "/crciwms/attence/listAttenceDetailInfo", //获取扫描件列表
  getListAuthTree: "/crciwms/organization/listOrganizationTree", //获取有权限的机构
  getListSummary:"/crciwms/attence/listAttenceGeneralInfo",//获取考勤汇总
  /**
   * 申诉处理
   */
  getListAppeal: "/crciwms/appeal/listAppealInfo", //获取申诉处理列表
  updateAppeal: "/crciwms/appeal/updateAppealStatus", //申诉处理核销
  deleteAnnex: "/crciwms/attence/deleteAttenceDetail", //删除附件
  downLoadAnnex: "/crciwms/attence/downloadAttencePDF", //下载附件
  getAppealInfo:"/crciwms//appeal/getAppealInfo",//获取申诉处理信息
  /**
   * 进退场查询统计
   */
  getListTransfer: "/crciwms/transfer/listTransferGeneralInfo", //统计列表
  downLoadInout: "/crciwms/transfer/exportTransferGeneralInfo", //导出进退场名册
  /**
   * 考勤查询统计
   */
  getQueryAttence: "/crciwms/attence/listAttenceGeneralInfo", //获取考勤列表
  downLoadAttence: "/crciwms/attence/exportAttenceGeneralInfo", //导出考勤名册
  /**
   * 合同查询
   */
  getListContract: "/crciwms/contract/listContractInfo", //合同查询列表
  downloadContract: "/crciwms/contract/downLoadContractPDF", //下载合同附件

};
