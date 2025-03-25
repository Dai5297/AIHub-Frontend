import request from "@/util/request.js";

/**
 * 发送消息
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function sendMessage(data) {
    return request.post('/ai/chat', data)
}

/**
 * 获取当前用户聊天记录
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function getChatHistory() {
    return request.get('/ai/chat/history')
}

/**
 * 获取聊天记录详情
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function getDetailHistory(data) {
    return request.get('/ai/chat/detail', data)
}