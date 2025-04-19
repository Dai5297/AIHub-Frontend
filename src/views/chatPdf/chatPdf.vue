<script setup>
import { ElMessage, ElLoading } from 'element-plus'
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
  deleteChat,
  sendNewChat,
} from '@/api/chatPdf.js'
import { marked } from 'marked'

// 基础状态变量
const isFirstMessage = ref(false)
const currentChatId = ref('')
const isOnlineSearch = ref(true)
const histories = ref([])
const isLoading = ref(false)

// PDF相关状态
const currentPdf = ref(null)
const uploadRef = ref(null)
const uploadProgress = ref(0)
const isUploading = ref(false)

// 上传配置
const uploadConfig = {
  accept: '.pdf',
  'auto-upload': false,
  limit: 1,
}

// 欢迎语
const messages = ref([
  {
    sender: 'ai',
    content: `<p>您好，我是PDF智能解析助手，请上传您需要分析的PDF文件</p>`,
  },
])

// Markdown配置
marked.setOptions({
  breaks: false,
  gfm: true,
  headerIds: false,
})

// 打字机效果函数
const addStreamingMessage = (content) => {
  const aiMessage = {
    sender: 'ai',
    content: '',
    isTyping: true,
  }
  messages.value.push(aiMessage)
  messages.value = [...messages.value]

  let index = 0
  const intervalId = setInterval(() => {
    if (index < content.length) {
      aiMessage.content = marked(content.substring(0, index + 1))
        .replace(/\n$/, '')
        .replace(/<\/p>\n/g, '</p>')
        .replace(/(<[^>]+>)\n/g, '$1')
      index++
      messages.value = [...messages.value]
    } else {
      aiMessage.isTyping = false
      messages.value = [...messages.value]
      clearInterval(intervalId)
    }
  }, 30)
}

// PDF上传处理
const handlePdfUpload = async (file) => {
  // 文件类型验证
  const isPdf =
    file.type === 'application/pdf' ||
    (file.name && file.name.toLowerCase().endsWith('.pdf')) ||
    file.raw?.type === 'application/pdf'

  if (!isPdf) {
    ElMessage.error('仅支持PDF格式文件！')
    return false
  }

  // 文件大小验证
  const MAX_SIZE_MB = 10
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    ElMessage.error(`文件大小不能超过${MAX_SIZE_MB}MB！`)
    return false
  }

  isLoading.value = true
  isUploading.value = true
  uploadProgress.value = 0

  try {
    // 检查是否已有选中的对话
    const currentHistory = histories.value.find(h => h.id === currentChatId.value)
    
    // 确定使用的ID和memoryId
    let newId, memoryId;
    
    if (currentHistory && currentHistory.title === '新对话') {
      // 如果当前已选中一个"新对话"，则使用该对话的ID和memoryId
      newId = currentHistory.id
      memoryId = currentHistory.memoryId
    } else {
      // 否则创建新的ID和memoryId
      newId = Date.now().toString().slice(-6)
      memoryId = Date.now().toString()
      
      // 清除现有的新对话
      histories.value = histories.value.filter(item => item.title !== '新对话')
      
      // 添加新对话到历史记录
      histories.value.unshift({
        id: newId,
        title: '新对话',
        memoryId: memoryId,
      })
      
      // 设置当前会话ID
      currentChatId.value = newId
    }

    // 获取原始文件对象
    const rawFile = file.raw || file
    const fileName = rawFile.name

    // 创建进度监听器
    const progressListener = (event) => {
      if (event.lengthComputable) {
        uploadProgress.value = Math.round((event.loaded / event.total) * 100)
      }
    }

    // 添加进度监听
    window.addEventListener('progress', progressListener, false)

    try {
      // 使用封装好的API函数上传文件
      const response = await uploadPdfFile({
        file: rawFile,
        memoryId: memoryId,
        fileName: fileName
      })
      
      // 处理上传成功
      if (response.code === 200) {
        ElMessage.success('文件上传成功！')
        
        // 保存PDF信息，确保使用一致的memoryId
        currentPdf.value = {
          name: fileName,
          size: `${(rawFile.size / 1024 / 1024).toFixed(2)}MB`,
          id: newId,
          memoryId: memoryId,
        }

        // 设置欢迎消息
        messages.value = [
          {
            sender: 'ai',
            content: `<p>我已经成功读取了您的PDF文件 <strong>${fileName}</strong>。现在您可以问我关于这份文档的任何问题，例如:</p><ul><li>这份文档的主要内容是什么？</li><li>请总结一下第X页的要点</li><li>文档中关于X主题的内容在哪里？</li></ul><p>请在下方输入您的问题。</p>`,
          },
        ]
        
        // 创建新会话或更新现有会话，确保使用相同的memoryId
        try {
          if (currentHistory && currentHistory.title === '新对话') {
            // 如果使用现有的"新对话"，则只更新PDF信息而不创建新会话
            console.log('使用现有的新对话，无需创建新会话')
          } else {
            // 如果是新创建的对话，则调用API创建新会话
            await sendNewChat({
              id: newId,
              memoryId: memoryId
            })
          }
        } catch (error) {
          console.error('创建对话失败:', error)
        }
      } else {
        ElMessage.error(response.msg || `上传失败（错误码：${response.code}）`)
        currentPdf.value = null
      }
    } finally {
      // 移除进度监听
      window.removeEventListener('progress', progressListener)
    }
  } catch (error) {
    console.error('上传异常:', error)
    ElMessage.error(`上传失败：${error.message || '服务器异常'}`)
    currentPdf.value = null
  } finally {
    isLoading.value = false
    isUploading.value = false
    uploadProgress.value = 0
  }

  return false
}

// 移除PDF
const handleRemovePdf = () => {
  currentPdf.value = null
  messages.value = [
    {
      sender: 'ai',
      content: `<p>您好，我是PDF智能解析助手，请上传您需要分析的PDF文件</p>`,
    },
  ]
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

  // 显示加载动画
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    lock: true,
    text: '正在处理您的问题...',
    background: 'rgba(255, 255, 255, 0.8)',
  })

  // 首先从对话历史中获取memoryId，确保与handleChangeChat中使用的一致
  const currentHistory = histories.value.find(h => h.id === currentChatId.value)
  // 如果历史记录中存在，则使用历史记录中的memoryId，否则才使用PDF对象中的
  const memoryId = currentHistory?.memoryId || currentPdf.value.memoryId
  
  // 准备请求数据
  const data = {
    message: message,
    pdfName: currentPdf.value.name,
    memoryId: memoryId,
    isOnlineSearch: isOnlineSearch.value
  }

  try {
    const stream = await sendMessage(data)
    const reader = stream.getReader()
    const decoder = new TextDecoder()
    let result = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      result += chunk
    }

    // 添加AI回复
    addStreamingMessage(result)
    reader.releaseLock()
  } catch (error) {
    // 添加错误消息
    messages.value.push({
      sender: 'ai',
      content: `<p>抱歉，请求失败: ${error.message}</p>`,
    })
    ElMessage.error('请求失败: ' + error.message)
  } finally {
    isLoading.value = false
    loadingInstance.close()
  }

  // 处理第一条消息的标题更新
  if (isFirstMessage.value) {
    try {
      const res = await getChatTitle(data)
      if (res.code === 200) {
        const newHistories = [...histories.value]
        for (let i = 0; i < newHistories.length; i++) {
          if (newHistories[i].id === currentChatId.value) {
            newHistories[i].title = res.data
          }
        }
        histories.value = newHistories
      }
    } catch (error) {
      console.error('获取标题失败:', error)
    }
    isFirstMessage.value = false
  }
}

// 清空对话
const handleClearChat = () => {
  if (currentPdf.value) {
    messages.value = [
      {
        sender: 'ai',
        content: `<p>我已经成功读取了您的PDF文件 <strong>${currentPdf.value.name}</strong>。请问有什么可以帮助您的？</p>`,
      },
    ]
  } else {
    messages.value = [
      {
        sender: 'ai',
        content: `<p>您好，我是PDF智能解析助手，请上传您需要分析的PDF文件</p>`,
      },
    ]
  }
}

// 创建新对话
const handleNewChat = async () => {
  if (histories.value.some((item) => item.title === '新对话')) {
    ElMessage.error('您已经创建了一个新的对话')
    return
  }
  
  const newId = Date.now().toString().slice(-6)
  const memoryId = Date.now().toString()
  
  currentChatId.value = newId
  currentPdf.value = null
  
  histories.value.unshift({
    id: newId,
    title: '新对话',
    memoryId: memoryId,
  })
  
  messages.value = [
    {
      sender: 'ai',
      content: `<p>您好，我是PDF智能解析助手，请上传您需要分析的PDF文件</p>`,
    },
  ]
  
  try {
    await sendNewChat({
      id: newId,
      memoryId: memoryId
    })
  } catch (error) {
    console.error('创建对话失败:', error)
    ElMessage.error('创建对话失败，请重试')
  }
}

// 切换对话
const handleChangeChat = async ({ id }) => {
  currentChatId.value = id
  messages.value = []
  isLoading.value = true
  
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    lock: true,
    text: '加载对话历史中...',
    background: 'rgba(255, 255, 255, 0.8)',
  })
  
  try {
    // 先从历史记录中查找与当前ID匹配的记录，确保获取正确的memoryId
    const historyItem = histories.value.find(h => h.id === id)
    if (!historyItem) {
      throw new Error('找不到对应的对话历史')
    }
    
    // 使用历史记录中的memoryId作为请求参数
    const effectiveMemoryId = historyItem.memoryId
    
    // 根据ID查找详细历史
    const res = await getDetailHistory({ id })
    
    if (res.code === 200) {
      // 处理PDF信息，使用历史记录中的memoryId而不是生成新的
      if (res.data.fileName) {
        currentPdf.value = {
          name: res.data.fileName,
          size: '',
          id: id,
          // 始终使用历史记录中的memoryId，确保一致性
          memoryId: effectiveMemoryId,
        }
      } else {
        currentPdf.value = null
      }
      
      // 处理消息历史
      const historyData = res.data.historyVos || (Array.isArray(res.data) ? res.data : [])
      
      if (historyData.length > 0) {
        const formattedMessages = historyData.map(message => {
          if (message.sender === 'ai') {
            message.content = marked(message.content || '')
              .replace(/\n$/, '')
              .replace(/<\/p>\n/g, '</p>')
              .replace(/(<[^>]+>)\n/g, '$1')
          }
          return message
        })
        
        messages.value = formattedMessages
      } else {
        messages.value = [
          {
            sender: 'ai',
            content: currentPdf.value
              ? `<p>已加载PDF文件: <strong>${currentPdf.value.name}</strong>，请问有什么可以帮助您的？</p>`
              : '<p>您好，我是PDF智能解析助手，请上传您需要分析的PDF文件</p>',
          },
        ]
      }
    } else {
      ElMessage.error(res.msg || '获取对话历史失败')
      messages.value = [
        {
          sender: 'ai',
          content: '<p>加载对话历史失败，请重试</p>',
        },
      ]
    }
  } catch (error) {
    ElMessage.error(`加载失败: ${error.message}`)
    messages.value = [
      {
        sender: 'ai',
        content: '<p>加载对话历史时发生错误</p>',
      },
    ]
  } finally {
    isLoading.value = false
    loadingInstance.close()
  }
}

// 删除对话
const handleDeleteChat = async (payload) => {
  try {
    const { id } = payload
    const res = await deleteChat(id)

    if (res.code === 200) {
      ElMessage.success('删除成功')
      histories.value = histories.value.filter(item => item.id !== id)

      if (currentChatId.value === id) {
        if (histories.value.length > 0) {
          await handleChangeChat({
            id: histories.value[0].id,
          })
        } else {
          await handleNewChat()
        }
      }
    } else {
      ElMessage.error(res.msg || '删除失败')
    }
  } catch (error) {
    ElMessage.error(`删除失败: ${error.message}`)
  }
}

// 获取聊天历史
const getHistory = async () => {
  try {
    const res = await getChatHistory()
    
    if (res.code === 200) {
      histories.value = res.data.map(item => ({
        id: item.id,
        title: item.title,
        memoryId: item.memoryId || Date.now().toString(),
      }))
      
      if (histories.value.length > 0) {
        currentChatId.value = histories.value[0].id
      }
    }
  } catch (error) {
    console.error('获取历史记录失败:', error)
    ElMessage.error('获取历史记录失败')
  }
}

// 页面加载
onMounted(async () => {
  await getHistory()

  if (currentChatId.value) {
    const target = histories.value.find(h => h.id === currentChatId.value)
    if (target?.memoryId) {
      await handleChangeChat({
        id: currentChatId.value,
      })
    }
  } else if (histories.value.length === 0) {
    await handleNewChat()
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
      @delete-chat="handleDeleteChat"
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
        <!-- 上传进度条 -->
        <div v-if="isUploading" class="upload-progress">
          <el-progress
            :percentage="uploadProgress"
            :stroke-width="8"
            status="success"
            :show-text="true"
            :color="'#F56565'"
          ></el-progress>
          <div class="progress-status">PDF文件上传中，请稍候...</div>
        </div>
      </div>
      <div v-else class="pdf-info">
        <div class="pdf-details">
          <el-icon><Document /></el-icon>
          <span class="pdf-name">{{ currentPdf.name }}</span>
          <span class="pdf-size">{{ currentPdf.size }}</span>
          <a
            v-if="currentPdf.url"
            :href="currentPdf.url"
            target="_blank"
            class="view-pdf-link"
            title="在新窗口查看PDF"
          >
            查看原文件
          </a>
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
  flex-direction: column;
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
  color: #f56565;
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

/* 进度条样式 */
.upload-progress {
  width: 100%;
  max-width: 500px;
  margin-top: 24px;
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.progress-status {
  margin-top: 8px;
  font-size: 14px;
  color: #718096;
  text-align: center;
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
  color: #f56565;
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

.view-pdf-link {
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #f8fafc;
  color: #f56565;
  font-size: 13px;
  text-decoration: none;
  transition: all 0.2s;
  border: 1px solid #f56565;
  white-space: nowrap;
}

.view-pdf-link:hover {
  background-color: #f56565;
  color: white;
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

  .upload-progress {
    max-width: 100%;
  }
}
</style>
