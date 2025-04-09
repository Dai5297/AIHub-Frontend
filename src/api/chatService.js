import request from '@/util/request.js'

/**
 * 发送消息
 * @param data
 * @returns {Promise<ReadableStream>}
 */
export async function sendMessage({ memoryId, message, isQuickReply }) {
  try {
    if (memoryId) {
      localStorage.setItem('chatMemoryId', memoryId)
    }
    const response = await fetch('/api/ai/service', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('Authorization') || '',
      },
      body: JSON.stringify({ memoryId, message, quickReply: isQuickReply }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    if (!response.body) {
      throw new Error('ReadableStream not supported in this browser')
    }

    return response.body
  } catch (error) {
    console.error('Error sending message:', error)
    throw error
  }
}

/**
 * 为当前对话生成标题
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function getChatTitle() {
  return request.post('/ai/service/title')
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
export function getDetailHistory(id) {
  return request.get(`/ai/service/detail/${id}`)
}

/**
 * 新建对话
 * @param {string} id 对话ID
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function sendNewChat(id) {
  return request.post(`/ai/service/new/${id}`)
}

/**
 * 删除对话
 * @param {string} id 对话ID
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export function deleteChat(id) {
  return request.delete(`/ai/service/delete/${id}`)
}
