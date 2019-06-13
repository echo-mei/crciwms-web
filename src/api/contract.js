import axios from "axios";

// 获取合同信息
export const getContract = (personOid) => {
    return axios.request({
        url: `/crciwms/contract/getContractByPersonOid`,
        params:{personOid:personOid},
        method: 'get'
    })
}

// 修改合同信息
export const updateContract = (contractOid, data) => {
    return axios.request({
        url: `/crciwms/contract/${contractOid}`,
        data,
        method: 'put'
    })
}

//合同附件上传
export const uploadContractFile = (data) => {
    return axios.request({
        url: `/crciwms/contract/uploadContract`,
        data,
        method: 'post'
    })
}

export const getContractFile = (data) => {
    return axios.request({
        url: `/crciwms/contract/downLoadContract`,
        params: data,
        // 将responseType的默认json改为blob
        responseType: 'blob',
        method: 'get'
    })
}

export const getContractPdf = (data) => {
    return axios.request({
        url: `/crciwms/contract/downLoadContractPDF`,
        params: data,
        // 将responseType的默认json改为blob
        responseType: 'blob',
        method: 'get'
    })
}
