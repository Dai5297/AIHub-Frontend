import request from '@/util/request.js'

/**
 * 发送消息
 * @param {Object} data 请求数据对象
 * @param {string} data.message 用户消息
 * @param {string} data.memoryId 会话记忆ID
 * @param {string} data.pdfName PDF文件名
 * @param {boolean} data.isOnlineSearch 是否开启联网搜索
 * @returns {Promise<ReadableStream>} 流式响应
 */
export async function sendMessage({ memoryId, message, pdfName, isOnlineSearch }) {
  try {
    const response = await fetch('/api/ai/pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('Authorization') || '',
      },
      body: JSON.stringify({ 
        memoryId, 
        message, 
        pdfName, 
        onlineSearch: isOnlineSearch 
      }),
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
 * 上传PDF文件
 * @param {Object} data 上传数据
 * @param {File} data.file PDF文件对象
 * @param {string} data.memoryId 会话记忆ID
 * @param {string} data.fileName 文件名称（可选）
 * @returns {Promise<Response>}
 */
export async function uploadPdfFile(data) {
  const { file, memoryId, fileName } = data;
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('memoryId', memoryId);
  
  // 如果提供了文件名，也添加到请求中
  if (fileName) {
    formData.append('fileName', fileName);
  }
  
  return request.post('/ai/pdf/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/**
 * 为当前对话生成标题
 * @returns {Promise<Response>}
 */
export async function getChatTitle(data) {
  return request.post('/ai/pdf/title', data)
}

/**
 * 获取当前用户聊天记录
 * @returns {Promise<Response>}
 */
export async function getChatHistory() {
  return request.get('/ai/pdf/history')
}

/**
 * 获取聊天记录详情
 * @param {Object} params 请求参数
 * @param {string} params.id 对话ID
 * @returns {Promise<Response>}
 */
export async function getDetailHistory({ id }) {
  return request.get(`/ai/pdf/history/${id}`)
}

/**
 * 新建对话
 * @param {Object} data 请求数据对象
 * @param {string} data.id 对话ID
 * @param {string} data.memoryId 会话记忆ID
 * @returns {Promise<Response>}
 */
export async function sendNewChat({ id, memoryId }) {
  return request.post(`/ai/pdf/new/${id}`, { memoryId })
}

/**
 * 删除对话
 * @param {string} id 对话ID
 * @returns {Promise<Response>}
 */
export async function deleteChat(id) {
  return request.delete(`/ai/pdf/delete/${id}`)
}
