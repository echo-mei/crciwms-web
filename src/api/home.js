import axios from "axios";
import requestApi from "@/assets/js/requestApi.js";

//人员合同不全数量
export const getNotContractCount = (unitOid) => {
  return axios.request({
    url: `${requestApi.getNotContractCount}`,
    method: 'get'
  })
}
//人员证照不全数量
export const getNotImageCount = (unitOid) => {
  return axios.request({
    url: `${requestApi.getNotImageCount}`,
    method: 'get'
  })
}

//人员分部汇总
export const getPersonStatisticsInfo = (unitOid) => {
  return axios.request({
    url: `${requestApi.getPersonStatisticsInfo}`,
    method: 'get'
  })
}

//工资待发放数量
export const getWaitPaidWageCount = (unitType) => {
  if (unitType == '03' || unitType == '04')//项目部、项目分部
    return axios.request({
      url: `${requestApi.getWaitPaidWageCount}`,
      method: 'get'
    })
  if (unitType == '02')//架子队
    return axios.request({
      url: `${requestApi.getJzdWaitPaidWageCount}`,
      method: 'get'
    })
}

// 申诉处理数量
export const getAppealInfoTotal = (unitOid) => {
  return axios.request({
    url: `${requestApi.getAppealInfoTotal}`,
    method: 'get'
  })
}
