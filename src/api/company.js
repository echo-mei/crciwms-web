import axios from "axios";
import requestApi from "@/assets/js/requestApi.js";

// 获取劳务公司列表
export const listCompany = () => {
  return axios.request({
    url: `/crciwms/company/listCompanyInfo`,
    method: 'get'
  })
}

// 列出可导出工资确认表的劳务公司清单
export const exportWageCompanyList = (unitOid) => {
  const data = {
    unitOid: unitOid
  }
  return axios.request({
    url: requestApi.exportWageCompanyList,
    method: 'get',
    params: data
  })
}
// 列出可导入工资信息的劳务公司清单
export const importWageCompanyList = (unitOid) => {
  const data = {
    unitOid: unitOid
  }
  return axios.request({
    url: requestApi.importWageCompanyList,
    method: 'get',
    params: data
  })
}
