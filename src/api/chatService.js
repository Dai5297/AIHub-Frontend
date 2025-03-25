import request from "@/util/request.js";

/**
 * 发送消息
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function sendMessage(data) {
    return request.post('/ai/service', data)
}

/**
 * 获取聊天记录
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function getChatHistory() {
    return request.get('/ai/service/history')
}

/**
 * 获取聊天记录详情
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function getDetailHistory(data) {
    return request.get('/ai/service/detail', data)
}