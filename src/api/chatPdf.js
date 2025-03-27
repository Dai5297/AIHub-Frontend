import request from "@/util/request.js";

/**
 * 发送消息
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function sendMessage(data) {
    return request.post('/275098505', data)
}

/**
 * 为当前对话生成标题
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function getChatTitle() {
    return request.post('/276713838')
}

/**
 * 获取当前用户聊天记录
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function getChatHistory() {
    return request.get('/275098702')
}

/**
 * 获取聊天记录详情
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function getDetailHistory(id) {
    return request.get(`/275099263`)
}

/**
 * 上传PDF文件
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function uploadPdfFile(data) {
    return request.post('/275099263', data)
}