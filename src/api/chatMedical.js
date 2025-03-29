import request from '@/util/request.js'

/**
 * 发送消息
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function sendMessage(data) {
  return fetch('/api/ai/medical', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Authorization') || '',
    },
    body: JSON.stringify(data),
  })
}

/**
 * 为当前对话生成标题
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function getChatTitle() {
  return request.post('/ai/medical/title')
}

/**
 * 获取聊天记录
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function getChatHistory() {
  return request.get('/ai/medical/history')
}

/**
 * 获取聊天记录详情
 * @param data
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function getDetailHistory(data) {
  return request.get('/ai/medical/detail', data)
}
