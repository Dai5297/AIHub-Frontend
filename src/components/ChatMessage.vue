<script setup>
import { nextTick } from 'vue'

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

// 自动滚动到最新消息
import { ref, onUpdated } from 'vue'
const messageContainer = ref(null)

// 监听消息变化，自动滚动到底部
const scrollToBottom = async () => {
  await nextTick() // 等待DOM更新[3](@ref)
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

onUpdated(scrollToBottom)
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
  background-color: #4776E6;
  color: white;
}

.ai-avatar {
  background-color: #8E54E9;
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
}

.ai-bubble {
  background-color: white;
  color: #334155;
  border-top-left-radius: 4px;
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
  display: inline-block;
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
  overflow-x: auto;
  margin: 12px 0;
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
</style>
