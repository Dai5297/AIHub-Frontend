<script setup>
import { nextTick } from 'vue'
import { DocumentCopy } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref, onUpdated, onMounted } from 'vue'

// 定义props用于接收消息数据
defineProps({
  messages: {
    type: Array,
    required: true,
    default: () => [],
  },
  themeColor: {
    type: String,
    default: '#409eff', // 默认主题色
  },
})

// 格式化消息内容的方法
const formatMessage = (content) => {
  // 如果内容已经是HTML格式，直接返回
  if (content.includes('<p>')) {
    return content
  }
  // 简单处理纯文本，将其包装在p标签中
  return content
    .replace(/<\/?p>/g, '') // 移除已有p标签
    .replace(/(^[\n\t\r]+|[\n\t\r]+$)/g, '') // 去除首尾空白
    .replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '<br>') // 转换换行为<br>
}

// 复制消息内容
const copyContent = (content) => {
  try {
    navigator.clipboard.writeText(content.replace(/<[^>]+>/g, ''))
    ElMessage.success('复制成功')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 复制代码块内容
const copyCodeBlock = (codeText) => {
  try {
    navigator.clipboard.writeText(codeText)
    ElMessage.success('代码复制成功')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

const messageContainer = ref(null)

// 监听消息变化，自动滚动到底部
const scrollToBottom = async () => {
  await nextTick() // 等待DOM更新
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

// 在DOM更新后为代码块添加复制按钮
const addCopyButtonsToCodeBlocks = () => {
  if (!messageContainer.value) return
  
  const codeBlocks = messageContainer.value.querySelectorAll('pre')
  codeBlocks.forEach(block => {
    // 检查是否已经添加了复制按钮
    if (block.querySelector('.code-copy-button')) return
    
    // 创建复制按钮
    const copyButton = document.createElement('button')
    copyButton.className = 'code-copy-button'
    copyButton.innerHTML = '<i class="el-icon"><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M768 832a128 128 0 0 1-128 128H192A128 128 0 0 1 64 832V384a128 128 0 0 1 128-128v64a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64v-64h64z"></path><path fill="currentColor" d="M384 128a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64V192a64 64 0 0 0-64-64H384zm0-64h448a128 128 0 0 1 128 128v448a128 128 0 0 1-128 128H384a128 128 0 0 1-128-128V192A128 128 0 0 1 384 64z"></path></svg></i>'
    copyButton.title = '复制代码'
    
    // 添加点击事件
    copyButton.addEventListener('click', () => {
      // 使用常规JavaScript获取代码文本
      const codeElement = block.querySelector('code')
      const codeText = codeElement ? codeElement.textContent : block.textContent
      copyCodeBlock(codeText)
    })
    
    // 将按钮添加到代码块
    block.style.position = 'relative'
    block.appendChild(copyButton)
  })
}

onUpdated(() => {
  scrollToBottom()
  nextTick(() => {
    addCopyButtonsToCodeBlocks()
  })
})

onMounted(() => {
  nextTick(() => {
    addCopyButtonsToCodeBlocks()
  })
})
</script>

<template>
  <div class="chat-message" ref="messageContainer">
    <div class="message-container">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="message.sender === 'user' ? 'message user-message' : 'message ai-message'"
      >
        <!-- AI消息 -->
        <template v-if="message.sender === 'ai'">
          <div class="sender-avatar ai-avatar">
            <span>AI</span>
          </div>
          <div class="bubble ai-bubble">
            <div v-if="message.isTyping" class="typing-indicator">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
            <span class="message-content">
              <span v-html="formatMessage(message.content)"></span>
              <span v-if="message.isTyping" class="cursor">|</span>
              <el-icon class="copy-button" :size="16" @click="copyContent(message.content)">
                <DocumentCopy />
              </el-icon>
            </span>
          </div>
        </template>

        <!-- 用户消息 -->
        <template v-else>
          <div class="sender-avatar user-avatar">
            <span>我</span>
          </div>
          <div class="bubble user-bubble" :style="{ backgroundColor: themeColor }">
            <span class="message-content">
              <span v-html="formatMessage(message.content)"></span>
              <el-icon class="copy-button" :size="16" @click="copyContent(message.content)">
                <DocumentCopy />
              </el-icon>
            </span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-message {
  width: 100%;
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background-color: #f8fafc;
}

.message-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 100%;
  padding-bottom: 24px;
  width: 100%;
  margin: 0 auto;
}

.message {
  display: flex;
  gap: 12px;
  max-width: 92%;
  align-items: flex-start;
}

.user-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.ai-message {
  align-self: flex-start;
}

.sender-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.user-avatar {
  background-color: #4776e6;
  color: white;
}

.ai-avatar {
  background-color: #8e54e9;
  color: white;
}

.bubble {
  padding: 14px 18px;
  border-radius: 18px;
  position: relative;
  word-break: break-word;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  max-width: calc(100% - 48px);
}

.user-bubble {
  color: white;
  border-top-right-radius: 4px;
  position: relative;
  padding-right: 40px;
}

.ai-bubble {
  background-color: white;
  color: #334155;
  border-top-left-radius: 4px;
  position: relative;
  padding-right: 40px;
}

.copy-button {
  position: absolute;
  right: 12px;
  top: 12px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s ease;
  opacity: 0.6;
}

.copy-button:hover {
  color: #409eff;
  opacity: 1;
  transform: scale(1.1);
}

.ai-bubble p {
  margin: 6px 0;
}

.ai-bubble p:first-child {
  margin-top: 0;
}

.ai-bubble p:last-child {
  margin-bottom: 0;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  align-items: center;
  height: 24px;
}

.dot {
  width: 6px;
  height: 6px;
  background-color: #64748b;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-6px);
  }
}

.message-content {
  -webkit-user-select: text !important;
  -moz-user-select: text !important;
  user-select: text !important;
  display: block;
  line-height: 1.6;
  font-size: 15px;
}

.cursor {
  display: inline;
  animation: blink 1s infinite;
  color: #64748b;
  margin-left: 2px;
  vertical-align: middle;
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

/* 代码块美化 */
:deep(pre) {
  background-color: #1e293b;
  color: #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  padding-right: 36px; /* 为复制按钮留出空间 */
  overflow-x: auto;
  margin: 12px 0;
  position: relative; /* 确保相对定位以便放置复制按钮 */
}

:deep(code) {
  font-family: 'Fira Code', monospace;
  font-size: 14px;
}

:deep(a) {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

:deep(a:hover) {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .message {
    max-width: 100%;
  }

  .bubble {
    max-width: calc(100% - 40px);
  }
}

/* 特殊样式-医疗主题 */
:deep(.medical-tip) {
  background-color: #eef7ff;
  border-left: 4px solid #409eff;
  padding: 10px 15px;
  margin: 10px 0;
  border-radius: 4px;
  font-size: 14px;
  color: #2c3e50;
}

:deep(.medical-warning) {
  background-color: #fef6e9;
  border-left: 4px solid #e6a23c;
  padding: 10px 15px;
  margin: 10px 0;
  border-radius: 4px;
  font-size: 14px;
  color: #8a5a00;
}

:deep(.medical-term) {
  color: #409eff;
  font-weight: 500;
  text-decoration: underline;
  text-decoration-style: dotted;
  cursor: help;
}

/* 代码块复制按钮样式 */
:deep(.code-copy-button) {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 4px;
  padding: 4px;
  cursor: pointer;
  color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  opacity: 0.6;
  z-index: 10;
}

:deep(.code-copy-button:hover) {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.2);
}

:deep(.code-copy-button i) {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
