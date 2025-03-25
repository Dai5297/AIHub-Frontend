import request from "@/util/request.js";

/**
 * 登录
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function login(data) {
    return request.post('/login', data)
}