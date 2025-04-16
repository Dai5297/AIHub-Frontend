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
      theme-color="#ff6b6b"
      @new-chat="handleNewChat"
      @change-chat="handleChangeChat"
    />
    <div class="chat-body">
      <div v-if="!currentPdf" class="upload-section">
        <el-upload
          ref="uploadRef"
          class="pdf-uploader"
          drag
          v-bind="uploadConfig"
          :on-change="handlePdfUpload"
        >
          <el-icon class="upload-icon" style="color: #ff6b6b">
            <Document />
          </el-icon>
          <div class="upload-text">
            <h3>将PDF文件拖到此处，或点击上传</h3>
            <p>单个文件不超过10MB</p>
          </div>
        </el-upload>
      </div>
      <div v-else class="pdf-info">
        <div class="pdf-details">
          <el-icon style="color: #ff6b6b">
            <Document />
          </el-icon>
          <span>{{ currentPdf.name }}</span>
          <span class="pdf-size">{{ currentPdf.size }}</span>
        </div>
        <el-button type="danger" link @click="handleRemovePdf"> 移除文件 </el-button>
      </div>
      <ChatMessage :messages="messages" theme-color="#ff6b6b" />
      <div class="input-section">
        <ChatInput
          style="margin-top: 20px"
          :loading="isLoading"
          :disabled="!currentPdf"
          :placeholder="currentPdf ? '请输入您的问题...' : '请先上传PDF文件'"
          theme-color="#ff6b6b"
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
}

.chat-body {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 15px;
  width: 80%;
  height: 100%;
  overflow: hidden;
}

.upload-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background-color: #f9f9f9;
  flex: 1;
}

.pdf-uploader {
  width: 100%;
  max-width: 500px;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.upload-text h3 {
  font-size: 16px;
  color: #606266;
  margin-bottom: 8px;
}

.upload-text p {
  font-size: 14px;
  color: #909399;
}

.pdf-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background-color: #f4f4f5;
  border-bottom: 1px solid #e4e4e4;
}

.pdf-details {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pdf-details .el-icon {
  font-size: 20px;
}

.pdf-size {
  color: #909399;
  font-size: 13px;
  margin-left: 8px;
}

.input-section {
  border-top: 1px solid #eee;
}
</style>
