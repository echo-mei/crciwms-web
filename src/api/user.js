import axios from "axios";
import requestApi from "@/assets/js/requestApi.js";
export const login = ({ accountNo, channel, deviceId, password }) => {
  const data = {
    accountNo,
    channel,
    deviceId,
    password
  }
  return axios.request({
    url: `${requestApi.login}`,
    data,
    method: 'post'
  })
}

// /base/getRSAPublicKey
export const getRSAPublicKey = () => {
  return axios.request({
    url: `${requestApi.getRSAPublicKey}`,
    method: 'get'
  })
}

export const logout = () => {
  return axios.request({
    url: '/base/logout',
    method: 'delete'
  })
}

export const getMenu = () => {
  return axios.request({
    url: `${requestApi.getMenu}`,
    method: 'get'
  })
}


export const getVersionNumber = () => {
  return axios.request({
    url: `${requestApi.getVersionNumber}`,
    method: 'get'
  })
}






