export default {
  // 过滤掉的白名单，可以请求的时候不显示loading提示框

  loadingWhiteList: [
    "listUsersInfo", // 用户管理 新增权限
    "checkAccountNo",
    "checkBankNo",
    "checkIdNo",
    "checkPhone",
    "listOrganizationTree",
  ],
  // 响应白名单，可以在响应返回的时候不做校验直接返回
  responseWhiteList: [
    "getImage",
    "exportPersonExcel",
    "downloadAttencePDF",
    "downLoadContract",
    "downLoadContractPDF",
    "downloadBankBill",
    "exportWageExcel", // 生成工资清单
    "exportWageBaseConfirmPDF", // 生成工资确认表
    "downloadWageConfirmPDF", // 工资确认表预览
    "exportWageGeneralInfo"
  ],
};
