<script setup>
import { ElMessage } from 'element-plus'
import { Document, Upload } from '@element-plus/icons-vue'
import ChatMessage from '@/components/ChatMessage.vue'
import ChatInput from '@/components/ChatInput.vue'
import ChatHistory from '@/components/ChatHistory.vue'
import { ref, onMounted } from 'vue'
import {
  sendMessage,
  getChatTitle,
  getDetailHistory,
  getChatHistory,
  uploadPdfFile,
} from '@/api/chatPdf.js'
import { marked } from 'marked'

// 聊天历史记录数据
const histories = ref([
  {
    id: '300001',
    title: '新对话',
  },
])

const isFirstMessage = ref()
const currentChatId = ref('')

// 示例消息数据
const messages = ref([])

// PDF文件状态
const currentPdf = ref(null)
const isLoading = ref(false)
const uploadRef = ref(null)

// 上传配置
const uploadConfig = {
  accept: '.pdf',
  'auto-upload': false,
  limit: 1,
}

// 打字机效果函数
const addStreamingMessage = (content) => {
  const aiMessage = {
    sender: 'ai',
    content: '',
    isTyping: true,
  }
  messages.value.push(aiMessage)
  // 立即触发更新以显示等待动画
  messages.value = [...messages.value]

  let index = 0
  const intervalId = setInterval(() => {
    if (index < content.length) {
      // 使用marked解析Markdown内容
      aiMessage.content = marked(content.substring(0, index + 1))
      index++
      messages.value = [...messages.value]
    } else {
      aiMessage.isTyping = false
      messages.value = [...messages.value]
      clearInterval(intervalId)
    }
  }, 30)
}

// 上传处理函数修改
const handlePdfUpload = async (file) => {
  // 强化文件类型验证（增加MIME类型检测）
  const isPdf = file.type === 'application/pdf' ||
      (file.name && file.name.toLowerCase().endsWith('.pdf')) ||
      (file.raw?.type === 'application/pdf') // 针对Element Plus组件特性验证[3,5](@ref)

  if (!isPdf) {
    ElMessage.error('仅支持PDF格式文件！')
    return false
  }

  // 强化文件大小验证（精确字节计算）
  const MAX_SIZE_MB = 10
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    ElMessage.error(`文件大小不能超过${MAX_SIZE_MB}MB！`)
    return false
  }

  isLoading.value = true

  try {
    const formData = new FormData()
    const newId = Date.now().toString().slice(-6)
    currentChatId.value = newId
    // 确保获取原始文件对象（兼容Element Plus组件）
    const rawFile = file.raw || file
    formData.append('file', rawFile) // 字段名与后端@RequestParam一致[4,8](@ref)
    formData.append('memoryId', newId)

    // 调用上传接口（强制multipart/form-data）
    const res = await uploadPdfFile(formData)

    if (res.code === 200) {
      // 处理成功逻辑...
    } else {
      ElMessage.error(res.msg || `上传失败（错误码：${res.code}）`)
    }
  } catch (error) {
    console.error('上传异常:', error)
    // 细化错误类型判断
    const msg = error.response?.data?.message ||
        (error.code === 'ECONNABORTED' ? '请求超时' : '服务器异常')
    ElMessage.error(`上传失败：${msg}`)
  } finally {
    isLoading.value = false
  }

  return false
}

// 移除PDF
const handleRemovePdf = () => {
  currentPdf.value = null
  messages.value = []
}

// 发送消息
const handleSendMessage = async (message) => {
  if (!currentPdf.value) {
    ElMessage.warning('请先上传PDF文件！')
    return
  }

  if (messages.value.length === 1) {
    isFirstMessage.value = true
  }

  // 添加用户消息
  messages.value.push({
    sender: 'user',
    content: message,
  })

  isLoading.value = true

  // 调用 API 发送消息
  const data = {
    message: message,
    pdfName: currentPdf.value ? currentPdf.value.name : '',
    chatId: currentChatId.value,
  }

  try {
    try {
      const stream = await sendMessage(data)

      // Handle streaming response
      const reader = stream.getReader()
      const decoder = new TextDecoder()
      let result = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        result += chunk
      }

      addStreamingMessage(result)
      reader.releaseLock()
    } catch (error) {
      ElMessage.error('请求失败: ' + error.message)
    }
  } catch (error) {
    ElMessage.error('网络错误，请稍后重试')
    console.error(error)
  } finally {
    isLoading.value = false
  }

  // 如果为第一个对话则发送请求获取对话标题
  if (isFirstMessage.value) {
    const res = await getChatTitle()
    if (res.code === 200) {
      histories.value.forEach((item) => {
        if (item.title === '新对话') {
          item.title = res.data.title
        }
      })
    } else {
      ElMessage.error('请求失败，请稍后重试')
    }
    isFirstMessage.value = false
  }
}

// 清空对话
const handleClearChat = () => {
  messages.value = []
}

// 创建新对话
const handleNewChat = () => {
  if (histories.value.some((item) => item.title === '新对话')) {
    ElMessage.error('您已经创建了一个新的对话')
    return
  }
  const newId = Date.now().toString().slice(-6)
  currentChatId.value = newId
  histories.value.push({
    id: newId,
    title: `新对话`,
  })
  messages.value = []
  currentPdf.value = null
}

// 切换对话
const handleChangeChat = async (id) => {
  currentChatId.value = id
  const res = await getDetailHistory(id)
  if (res.code === 200) {
    messages.value = res.data.messages
    if (res.data.pdf) {
      currentPdf.value = res.data.pdf
    } else {
      currentPdf.value = null
    }
  } else {
    ElMessage.error('请求失败，请稍后重试')
  }
}

// 获取对话信息
const getHistorty = async () => {
  const res = await getChatHistory()
  if (res.code === 200) {
    histories.value = res.data
    if (res.data.length > 0) {
      currentChatId.value = res.data[0].id
      const resDetail = await getDetailHistory(res.data[0].id)
      if (resDetail.code === 200) {
        messages.value = resDetail.data.messages
        if (resDetail.data.pdf) {
          currentPdf.value = resDetail.data.pdf
        }
      } else {
        ElMessage.error('请求失败，请稍后重试')
      }
    }
  } else {
    ElMessage.error('请求失败，请稍后重试')
  }
}

onMounted(async () => {
  await getHistorty()
  if (messages.value.length === 0) {
    isFirstMessage.value = true
  }
})
</script>

<template>
  <div class="chat-container">
    <ChatHistory
      :histories="histories"
      :current-chat-id="currentChatId"
      theme-color="#F56565"
      @new-chat="handleNewChat"
      @change-chat="handleChangeChat"
    />
    <div class="chat-body">
      <div class="chat-header">
        <h2>PDF 智能解析</h2>
      </div>
      <div v-if="!currentPdf" class="upload-section">
        <el-upload
          ref="uploadRef"
          class="pdf-uploader"
          drag
          v-bind="uploadConfig"
          :on-change="handlePdfUpload"
        >
          <div class="upload-content">
            <el-icon class="upload-icon">
              <Document />
            </el-icon>
            <div class="upload-text">
              <h3>将PDF文件拖到此处，或点击上传</h3>
              <p>单个文件不超过10MB</p>
            </div>
          </div>
        </el-upload>
      </div>
      <div v-else class="pdf-info">
        <div class="pdf-details">
          <el-icon><Document /></el-icon>
          <span class="pdf-name">{{ currentPdf.name }}</span>
          <span class="pdf-size">{{ currentPdf.size }}</span>
        </div>
        <el-button type="danger" link @click="handleRemovePdf">移除文件</el-button>
      </div>
      <ChatMessage :messages="messages" theme-color="#F56565" />
      <div class="input-section">
        <ChatInput
          :loading="isLoading"
          :disabled="!currentPdf"
          :placeholder="currentPdf ? '请输入您的问题...' : '请先上传PDF文件'"
          theme-color="#F56565"
          @send="handleSendMessage"
          @clear="handleClearChat"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #f5f7fa;
}

.chat-body {
  margin-left: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 16px;
  width: 85%;
  height: 100%;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.chat-header {
  padding: 16px 20px;
  border-bottom: 1px solid #edf2f7;
  background-color: #ffffff;
}

.chat-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
}

.upload-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background-color: #f8fafc;
  flex: 1;
}

.pdf-uploader {
  width: 100%;
  max-width: 500px;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
}

.upload-icon {
  font-size: 48px;
  color: #F56565;
  margin-bottom: 16px;
}

.upload-text h3 {
  font-size: 16px;
  color: #4a5568;
  margin-bottom: 8px;
  font-weight: 500;
}

.upload-text p {
  font-size: 14px;
  color: #718096;
}

.pdf-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: #f8fafc;
  border-bottom: 1px solid #edf2f7;
}

.pdf-details {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pdf-details .el-icon {
  font-size: 24px;
  color: #F56565;
}

.pdf-name {
  font-weight: 500;
  color: #2d3748;
}

.pdf-size {
  color: #718096;
  font-size: 13px;
  margin-left: 8px;
}

.input-section {
  border-top: 1px solid #edf2f7;
  padding: 16px 0 0;
  background-color: #ffffff;
}

@media (max-width: 768px) {
  .chat-body {
    width: 100%;
    margin-left: 0;
    border-radius: 0;
  }
  
  .chat-container {
    flex-direction: column;
  }
  
  .upload-section {
    padding: 20px;
  }
  
  .pdf-uploader {
    max-width: 100%;
  }
}
</style>
