import axios from "axios";
import requestApi from "@/assets/js/requestApi.js";

/**
 *  工资批次
 * @param {*} batchOid
 */
export const deleteBatch = (batchOid) => {
  return axios.request({
    url: `${requestApi.wageBatch}/${batchOid}`,
    method: 'delete'
  })
}

export const editBatch = ({
  batchDesc,
  batchName,
  unitOid,
  batchOid
}) => {
  const data = {
    batchDesc,
    batchName,
    unitOid,
    batchOid,
  }
  return axios.request({
    url: `${requestApi.wageBatch}/${batchOid}`,
    data,
    method: 'put'
  })
}

export const addBatch = ({
  batchDesc,
  batchName,
  unitOid
}) => {
  const data = {
    batchDesc,
    batchName,
    unitOid,
  }
  return axios.request({
    url: `${requestApi.wageBatch}`,
    data,
    method: 'post'
  })
}
//批次详情
export const getBatch = (batchOid) => {
  return axios.request({
    url: `${requestApi.wageBatch}/${batchOid}`,
    method: 'get'
  })
}

// 生成银行发放工资表
export const exportWageExcel = (batchOid) => {
  const data = {
    batchOid: batchOid
  }
  return axios.request({
    url: `${requestApi.exportWageExcel}`,
    params: data,
    method: 'get'
  })
}

// 确认发放批次


export const confirmWageBatch = (batchOid) => {
  const data = {
    batchOid: batchOid,
  }
  return axios.request({
    url: `${requestApi.confirmWageBatch}/`,
    params: data,
    method: 'put'
  })
}

// 取消确认发放批次
export const cancelWageBatch = (batchOid) => {
  const data = {
    batchOid: batchOid,
  }
  return axios.request({
    url: `${requestApi.cancelWageBatch}/`,
    params: data,
    method: 'put'
  })
}

// 完成发放批次
export const completedWageBatch = (batchOid) => {
  const data = {
    batchOid: batchOid,
  }
  return axios.request({
    url: `${requestApi.completedWageBatch}/`,
    params: data,
    method: 'put'
  })
}



//批次详情
export const listWagePlanByBatchOid = (batchOid) => {
  const data = {
    batchOid: batchOid
  }
  return axios.request({
    url: `${requestApi.listWagePlanByBatchOid}`,
    params: data,
    method: 'get'
  })
}

//下载银行回执单
export const downloadBankBill = (batchOid) => {
  const data = {
    batchOid: batchOid
  }
  return axios.request({
    url: `${requestApi.downloadBankBill}`,
    params: data,
    method: 'get',
    responseType: 'blob',
  })
}

//上传银行发放工资回执
export const uploadBankBill = (data) => {
  return axios.request({
    url: `${requestApi.uploadBankBill}`,
    data,
    method: 'post',
  })
}

//上传工资确认表
export const uploadWageConfirmPDF = (data, planOid) => {
  return axios.request({
    url: `${requestApi.uploadWageConfirmPDF}?planOid=${planOid}`,
    data,
    method: 'post'
  })
}


//导出工资确认表
export const exportWageBaseConfirmPDF = (planOid, companyOid) => {
  const data = {
    planOid: planOid,
    companyOid: companyOid
  }
  return axios.request({
    url: `${requestApi.exportWageBaseConfirmPDF}`,
    params: data,
    method: 'get'
  })
}
//查看工资确认表附件列表
export const listWageConfirmPDF = (planOid) => {
  const data = {
    planOid: planOid
  }
  return axios.request({
    url: `${requestApi.listWageConfirmPDF}`,
    params: data,
    method: 'get'
  })
}

//删除工资确认表附件列表
export const wagePlanDetail = (detailOid) => {
  return axios.request({
    url: `${requestApi.wagePlanDetail}/${detailOid}`,
    method: 'delete'
  })
}
//下载工资确认表附件列表
export const downloadWageConfirmPDF = (detailOid) => {
  const data = {
    detailOid: detailOid
  }
  return axios.request({
    url: `${requestApi.downloadWageConfirmPDF}`,
    params: data,
    method: 'get',
    responseType: 'blob',
  })
}

/**
 *  工资计划
 */


export const deletePlan = (planOid) => {
  return axios.request({
    url: `${requestApi.wagePlan}/${planOid}`,
    method: 'delete'
  })
}

export const editPlan = ({
  planDesc,
  planName,
  unitOid,
  planOid
}) => {
  const data = {
    planDesc,
    planName,
    unitOid,
    planOid
  }
  return axios.request({
    url: `${requestApi.wagePlan}/${planOid}`,
    data,
    method: 'put'
  })
}

export const addPlan = ({
  planDesc,
  planName,
  unitOid
}) => {
  const data = {
    planDesc,
    planName,
    unitOid,
  }
  return axios.request({
    url: `${requestApi.wagePlan}`,
    data,
    method: 'post'
  })
}
// 计划详情
export const getPlan = (planOid) => {
  return axios.request({
    url: `${requestApi.wagePlan}/${planOid}`,
    method: 'get'
  })
}

// 提交工资发放申请
export const submitWagePlan = (planOid) => {
  const data = {
    planOid: planOid
  }
  return axios.request({
    url: `${requestApi.submitWagePlan}`,
    params: data,
    method: 'put'
  })
}
// 撤回工资发放申请

export const recallWagePlan = (planOid) => {
  const data = {
    planOid: planOid
  }
  return axios.request({
    url: `${requestApi.recallWagePlan}`,
    params: data,
    method: 'put'
  })
}


//上传图片
export const uploadFile = (data, unitOid, planOid, companyOid) => {
  return axios.request({
    url: `${requestApi.writeWageBaseExcel}?unitOid=${unitOid}&planOid=${planOid}&companyOid=${companyOid}`,
    data,
    method: 'post'
  })
}

// 移除发放批次


export const deleteFromWageBatch = (planOid) => {
  const data = {
    planOid: planOid
  }
  return axios.request({
    url: `${requestApi.deleteFromWageBatch}`,
    params: data,
    method: 'put'
  })
}

//listWaitWagePlan

export const listWaitWagePlan = () => {
  return axios.request({
    url: `${requestApi.listWaitWagePlan}`,
    method: 'get'
  })
}

// 添加到发放批次
export const insertIntoWageBatch = (data) => {
  const d = {
    planOid: data.planOid,
    batchOid: data.batchOid,
  }
  return axios.request({
    url: `${requestApi.insertIntoWageBatch}`,
    params: d,
    method: 'put'
  })
}

// 删除工资信息
export const deleteWage = (wageOid) => {

  return axios.request({
    url: `${requestApi.deleteWage}/${wageOid}`,
    method: 'delete'
  })
}

//  导出工资发放列表信息
export const exportWageGeneralInfo = (data) => {
  return axios.request({
    url: `${requestApi.exportWageGeneralInfo}`,
    params: data,
    // 将responseType的默认json改为blob
    responseType: 'blob',
    method: 'get'
  })
}

//查询所有发放批次信息

export const listWageBatchInfoAll = () => {
  return axios.request({
    url: `${requestApi.listWageBatchInfoAll}`,
    method: 'get'
  })
}

//查询所有发放计划信息

export const listWagePlanInfoAll = () => {
  return axios.request({
    url: `${requestApi.listWagePlanInfoAll}`,
    method: 'get'
  })
}
