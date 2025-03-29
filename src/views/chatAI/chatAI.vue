<script setup>
import { ElMessage } from 'element-plus'
import ChatMessage from '@/components/ChatMessage.vue'
import ChatInput from '@/components/ChatInput.vue'
import ChatHistory from '@/components/ChatHistory.vue'
import { ref, onMounted, getCurrentInstance } from 'vue'
import {
  sendMessage,
  getChatTitle,
  getDetailHistory,
  getChatHistory,
  sendNewChat,
  deleteChat,
} from '@/api/chatAI.js'
import { marked } from 'marked'

const isFirstMessage = ref()

const currentChatId = ref()

// 聊天历史记录数据
const histories = ref([
  {
    id: '608866',
    title: '新对话',
  },
])

// 欢迎语
const messages = ref([
  {
    sender: 'ai',
    content: `<p>您好, 我是你的AI智能助手，有什么我能帮助你的吗</p>`,
  },
])

marked.setOptions({
  breaks: false, // 关闭自动换行转换
  gfm: true,
  headerIds: false,
})

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
        .replace(/\n$/, '')
        .replace(/<\/p>\n/g, '</p>')
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

  // 添加一个AI消息占位，显示加载动画
  const aiMessage = {
    sender: 'ai',
    content: '',
    isTyping: true,
  }
  messages.value.push(aiMessage)

  const data = {
    message: message,
    memoryId: currentChatId.value,
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

    // 移除加载中的消息
    messages.value.pop()
    // 添加实际的响应消息
    addStreamingMessage(result)
    reader.releaseLock()
  } catch (error) {
    // 移除加载中的消息
    messages.value.pop()
    // 添加错误消息
    messages.value.push({
      sender: 'ai',
      content: `<p>抱歉，请求失败: ${error.message}</p>`,
    })
    ElMessage.error('请求失败: ' + error.message)
  }

  isLoading.value = false

  //  如果为第一个对话则发送请求获取对话标题
  if (isFirstMessage.value) {
    const res = await getChatTitle(data)
    if (res.code === 200) {
      // 直接修改对象属性并强制更新，确保响应式更新
      const newHistories = [...histories.value]
      for (let i = 0; i < newHistories.length; i++) {
        if (newHistories[i].title === '新对话') {
          // 后端返回的数据格式是{"code":200,"msg":"操作成功","data":"晨曦曙光"}
          newHistories[i].title = res.data
          console.log('更新后的标题:', newHistories[i].title)
        }
      }
      // 强制更新整个数组以触发响应式更新
      histories.value = newHistories
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
const handleNewChat = async () => {
  if (histories.value.some((item) => item.title === '新对话')) {
    ElMessage.error('您已经创建了一个新的对话')
    return
  }
  const newId = Date.now().toString().slice(-6)
  currentChatId.value = newId
  histories.value.unshift({
    id: newId,
    title: `新对话`,
    memoryId: Date.now().toString(),
  })
  messages.value = [
    {
      sender: 'ai',
      content: `<p>您好, 我是你的AI智能助手，有什么我能帮助你的吗</p>`,
    },
  ]
  const res = await sendNewChat(newId)
  if (!res.code === 200) {
    ElMessage.error(res.msg)
  }
}

// 删除对话
const handleDeleteChat = async (payload) => {
  try {
    const { id } = payload // 正确解构参数
    const res = await deleteChat(id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      // 过滤掉被删除的对话
      histories.value = histories.value.filter((item) => item.id !== id)
      // 如果删除的是当前对话，则切换到第一个对话或创建新对话
      if (currentChatId.value === id) {
        if (histories.value.length > 0) {
          await handleChangeChat({
            id: histories.value[0].id,
            memoryId: histories.value[0].memoryId,
          })
        } else {
          await handleNewChat()
        }
      }
    } else {
      ElMessage.error(res.msg)
    }
  } catch (error) {
    ElMessage.error(`删除失败: ${error.message}`)
  }
}

//  切换对话
const handleChangeChat = async ({ id, memoryId }) => {
  currentChatId.value = id
  try {
    const res = await getDetailHistory({ id, memoryId })
    if (res.code === 200) {
      // 统一格式化AI消息
      const formattedMessages = JSON.parse(JSON.stringify(res.data)).map((message) => {
        if (message.sender === 'ai') {
          // 强制所有AI消息走Markdown转换流程[1](@ref)
          message.content = marked(message.content || '')
            .replace(/\n$/, '')
            .replace(/<\/p>\n/g, '</p>')
            .replace(/(<[^>]+>)\n/g, '$1') // 新增：清理标签后的换行
        }
        return message
      })
      messages.value = formattedMessages
    }
  } catch (error) {
    ElMessage.error(`加载失败: ${error.message}`)
  }
}

// 修改后的历史记录获取
const getHistorty = async () => {
  const res = await getChatHistory()
  if (res.code === 200) {
    histories.value = res.data.map((item) => ({
      id: item.id,
      title: item.title,
      memoryId: item.memoryId || Date.now().toString(), // 确保memoryId存在[5](@ref)
    }))
    // 设置第一个为当前对话
    if (histories.value.length > 0) {
      currentChatId.value = histories.value[0].id
    }
  }
}

onMounted(async () => {
  await getHistorty()

  // 等待历史记录加载完成后再获取详情
  if (currentChatId.value) {
    const target = histories.value.find((h) => h.id === currentChatId.value)
    if (target?.memoryId) {
      await handleChangeChat({
        id: currentChatId.value,
        memoryId: target.memoryId,
      })
    }
  }
})
</script>

<template>
  <div class="chat-container">
    <ChatHistory
      :histories="histories"
      :current-chat-id="currentChatId"
      theme-color="#409eff"
      @new-chat="handleNewChat"
      @change-chat="handleChangeChat"
      @delete-chat="handleDeleteChat"
    />
    <div class="chat-body">
      <ChatMessage :messages="messages" theme-color="#409eff" />
      <div class="input-section">
        <ChatInput
          :loading="isLoading"
          theme-color="#409eff"
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

.cursor {
  animation: blink 1s infinite;
  color: #409eff;
  display: inline;
  margin-left: 0;
  vertical-align: baseline;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
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
  --el-switch-on-color: #409eff;
}

.search-options :deep(.el-switch__label) {
  color: #606266;
  font-size: 14px;
}

.search-options :deep(.el-switch__label.is-active) {
  color: #409eff;
}

/* Styles for structured messages */
:deep(.message-content) h3 {
  color: #409eff;
  margin: 15px 0 10px;
  font-size: 1.1em;
  font-weight: bold;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

:deep(.message-content) ul {
  padding-left: 20px;
  margin: 10px 0;
}

:deep(.message-content) li {
  margin-bottom: 8px;
  line-height: 1.5;
}

:deep(.message-content) hr {
  border: none;
  border-top: 1px dashed #ddd;
  margin: 15px 0;
}

:deep(.message-content) {
  line-height: 1.6;
}
</style>
