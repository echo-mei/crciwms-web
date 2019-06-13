import axios from "axios";
import requestApi from "@/assets/js/requestApi.js";
export const deletOrg = (unitOid) => {
  return axios.request({
    url: `${requestApi.todoOrg}/${unitOid}`,
    method: 'delete'
  })
}

export const editOrg = ({contacts, isAuth, parentUnitName, parentUnitOid, phone, unitCode, unitName, unitOid, unitType}) => {
  const data = {
    contacts,
    isAuth,
    parentUnitName,
    parentUnitOid,
    phone,
    unitCode,
    unitName,
    unitOid,
    unitType,
  }
  return axios.request({
    url: `${requestApi.todoOrg}/${unitOid}`,
    data,
    method: 'put'
  })
}

export const addOrg = ({ phone, unitName, parentUnitOid, contacts, unitCode, unitType}) => {
  const data = {
    phone,
    unitName,
    parentUnitOid,
    contacts,
    unitCode,
    unitType
  }
  return axios.request({
    url:`${requestApi.todoOrg}`,
    data,
    method: 'post'
  })
}

export const getOrgType = (unitOid) => {
  const data = {
    unitOid:unitOid
  }
  return axios.request({
    url: `${requestApi.getOrgType}`,
    method: 'get',
    params:data
  })
}


export const getOrg = (unitOid) => {
  return axios.request({
    url: `/crciwms/organization/${unitOid}`,
    method: 'get'
  })
}


export const getOrgTreeList = () => {
  return axios.request({
    url: `${requestApi.orgTreeList}`,
    method: 'get'
  })
}

