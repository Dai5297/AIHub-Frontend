import request from "@/util/request.js";

/**
 * 获取用户详情
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function getUserDetail() {
    return request.get('/user/detail')
}

/**
 * 修改密码
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function changePassword(data) {
    return request.post('/user/changePassword', data)
}