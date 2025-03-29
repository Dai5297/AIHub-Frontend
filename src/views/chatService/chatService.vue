<script setup>
import { ElMessage } from 'element-plus'
import ChatMessage from '@/components/ChatMessage.vue'
import ChatInput from '@/components/ChatInput.vue'
import ChatHistory from '@/components/ChatHistory.vue'
import { ref, onMounted } from 'vue'
import { sendMessage, getChatTitle, getDetailHistory, getChatHistory } from '@/api/chatService.js'
import { marked } from 'marked'

// 是否开启快速回复
const isQuickReply = ref(true)

const isFirstMessage = ref()

const currentChatId = ref()

// 聊天历史记录数据
const histories = ref([
  {
    id: '200001',
    title: '新对话',
  },
])

// 欢迎语
const messages = ref([
  {
    sender: 'ai',
    content: `<p>您好！我是您的智能客服助手，很高兴为您服务。请问有什么可以帮助您的？</p>`,
  },
])

const isLoading = ref(false)

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

// 发送信息
const handleSendMessage = async (message) => {
  if (messages.value.length === 1) {
    isFirstMessage.value = true
  }
  isLoading.value = true
  // 添加用户消息
  messages.value.push({
    sender: 'user',
    content: message,
  })

  const data = {
    message: message,
    isQuickReply: isQuickReply.value,
  }

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

  isLoading.value = false

  //  如果为第一个对话则发送请求获取对话标题
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

//  清空对话
const handleClearChat = () => {
  messages.value = []
}

//  创建新对话
const handleNewChat = () => {
  if (histories.value.some((item) => item.title === '新对话')) {
    ElMessage.error('您已经创建了一个新的对话')
    return
  }
  const newId = Date.now().toString().slice(-6)
  currentChatId.value = newId
  currentMemoryId.value = ''
  histories.value.push({
    id: newId,
    title: `新对话`,
    memoryId: '',
  })
  messages.value = [
    {
      sender: 'ai',
      content: `<p>您好！我是您的智能客服助手，很高兴为您服务。请问有什么可以帮助您的？</p>`,
    },
  ]
}

//  切换对话
const handleChangeChat = async ({ id, memoryId }) => {
  currentChatId.value = id
  currentMemoryId.value = memoryId
  const res = await getDetailHistory(id)
  if (res.code === 200) {
    messages.value = [...res.data] // 强制触发响应式更新
  } else {
    ElMessage.error('请求失败，请稍后重试')
  }
}

//  获取对话信息
const getHistorty = async () => {
  const res = await getChatHistory()
  if (res.code === 200) {
    histories.value = res.data
    currentChatId.value = res.data[0].id
    const resDetail = await getDetailHistory(res.data[0].id)
    if (resDetail.code === 200) {
      messages.value = [...resDetail.data] // 强制触发响应式更新
    } else {
      ElMessage.error('请求失败，请稍后重试')
    }
  } else {
    ElMessage.error('请求失败，请稍后重试')
  }
}

const handleDeleteChat = async (id) => {
  const res = await deleteChatHistory(id)
  if (res.code === 200) {
    await getHistorty()
    ElMessage.success('删除成功')
  } else {
    ElMessage.error('删除失败，请稍后重试')
  }
}

onMounted(async () => {
  await getHistorty()
})
</script>

<template>
  <div class="chat-container">
    <ChatHistory
      :histories="histories"
      :current-chat-id="currentChatId"
      theme-color="#b265f8"
      @new-chat="handleNewChat"
      @change-chat="handleChangeChat"
    />
    <div class="chat-body">
      <ChatMessage :messages="messages" theme-color="#b265f8" />
      <div class="input-section">
        <ChatInput
          style="margin-top: 20px"
          :loading="isLoading"
          theme-color="#1e90ff"
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

.input-section {
  border-top: 1px solid #eee;
}

.search-options {
  padding: 8px 20px 0;
  background-color: #fff;
  display: flex;
  align-items: center;
}

.search-options :deep(.el-switch) {
  --el-switch-on-color: #1e90ff;
}

.search-options :deep(.el-switch__label) {
  color: #606266;
  font-size: 14px;
}

.search-options :deep(.el-switch__label.is-active) {
  color: #1e90ff;
}
</style>
