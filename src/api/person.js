import axios from "axios";

export const getDicItemList = (dicTypeCode) => {
  return axios.request({
    url: `/crciwms/dic/getDicItemList`,
    params: {
      dicTypeCode: dicTypeCode
    },
    method: 'get'
  })
}

// 获取班组列表
export const getDeptList = (unitOid) => {
  let deptList = [];
  return new Promise((resolve, reject) => {
    axios.request({
      url: `/crciwms/organization/listOrganizationByParentUnitOid/${unitOid}`,
      method: 'get'
    }).then(res => {
      deptList = res.result && res.result.filter(item => (item.unitType == "4"));
      resolve(deptList);
    }), err => {
      this.$Message.error(err);
      reject();
    };
  })
}

// 获取架子队列表
export const getUnitList = (unitOid) => {
  let deptList = [];
  return new Promise((resolve, reject) => {
    axios.request({
      url: `/crciwms/organization/listOrganizationByParentUnitOid/${unitOid}`,
      method: 'get'
    }).then(res => {
      deptList = res.result && res.result.filter(item => (item.unitType == "3"));
      resolve(deptList);
    }), err => {
      this.$Message.error(err);
      reject();
    };
  })
}

// 新增人员信息
export const addPerson = (data) => {
  return axios.request({
    url: `/crciwms/person`,
    data,
    method: 'post'
  })
}

//调入人员
export const transferPersons = (data)=>{
  return axios.request({
    url: `/crciwms/person/transferPerson`,
    params:data,
    method: 'post'
  })
}

//修改人员信息
export const updatePerson = (personOid, data) => {
  return axios.request({
    url: `/crciwms/person/${personOid}`,
    data,
    method: 'put'
  })
}

// 获取人员具体信息
export const getPerson = (personOid) => {
  return axios.request({
    url: `/crciwms/person/${personOid}`,
    method: 'get'
  })
}


// 删除人员
export const deletePerson = (personOid) => {
  return axios.request({
    url: `/crciwms/person/${personOid}`,
    method: 'delete'
  })
}

// 批量导入人员
export const uploadPerson = (data) => {
  return axios.request({
    url: `/crciwms/person/writePersonExcel`,
    data,
    method: 'post'
  })
}

//上传图片
export const uploadImage = (data) => {
  return axios.request({
    url: `/crciwms/person/insertImage`,
    data,
    method: 'post'
  })
}

// 获取证照图片
export const getImage = (data) => {
  return axios.request({
    url: `/crciwms/person/getImage`,
    params: data,
    // 将responseType的默认json改为blob
    responseType: 'blob',
    method: 'get'
  })
}

//删除图片
export const deleteImage = (data) => {
  return axios.request({
    url: `/crciwms/person/deleteImage/${data.personOid}/${data.imageType}`,
    // data,
    method: 'delete'
  })
}


// 验证银行卡号唯一性
export const checkBankNo = (data) => {
  return axios.request({
    url: `/crciwms/person/checkBankNo`,
    params: data,
    method: 'get'
  })
}

// 验证身份证号唯一性
export const checkIdNo = (data) => {
  return axios.request({
    url: `/crciwms/person/checkIdNo`,
    params: data,
    method: 'get'
  })
}

// 验证电话号码唯一性
export const checkPhone = (data) => {

  return axios.request({
    url: `/crciwms/person/checkPhone`,
    params: data,
    method: 'get'
  })
}

// 生成个人账号
export const personAccount = (personOid) => {
  return axios.request({
    url: `/crciwms/person/personAccount`,
    params: {personOids:personOid},
    method: 'get'
  })
}

// 个人账号是否存在的校验
export const accountNoCheck = (accountNo) => {
  return axios.request({
    url: `/crciwms/base/users/checkAccountNo`,
    params: {accountNo:accountNo},
    method: 'get'
  })
}

//导出人员名册
export const exportPersons = (data)=>{
  return axios.request({
    url: `/crciwms/person/exportPersonExcel`,
    params: data,
    // 将responseType的默认json改为blob
    responseType: 'blob',
    method: 'get'
  })
}


