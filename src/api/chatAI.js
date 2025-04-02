/**
 * 发送消息
 * @param data
 * @returns {Promise<ReadableStream>}
 */
import request from '@/util/request.js'

export async function sendMessage({ memoryId, message, isOnlineSearch }) {
  try {
    if (memoryId) {
      localStorage.setItem('chatMemoryId', memoryId)
    }
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('Authorization') || '',
      },
      body: JSON.stringify({ memoryId, message, onlineSearch: isOnlineSearch }),
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
 * @returns {Promise<Response>}
 */
export async function getChatTitle(data) {
  return request.post('/ai/chat/title', data)
}

/**
 * 获取当前用户聊天记录
 * @returns {Promise<Response>}
 */
export async function getChatHistory() {
  return request.get('/ai/chat/history')
}

/**
 * 获取聊天记录详情
 * @param id
 * @returns {Promise<Response>}
 */
export async function getDetailHistory({ id }) {
  return request.get(`/ai/chat/history/${id}`)
}

/**
 * 新建对话
 * @returns
 */
export async function sendNewChat(id) {
  return request.post(`/ai/chat/new/${id}`)
}

/**
 * 删除对话
 * @param {string} id 对话ID
 * @returns {Promise<Response>}
 */
export async function deleteChat(id) {
  return request.delete(`/ai/chat/delete/${id}`)
}
