<script setup>
// 定义props用于接收消息数据
defineProps({
  messages: {
    type: Array,
    required: true,
    default: () => []
  },
  themeColor: {
    type: String,
    default: '#409eff'  // 默认主题色
  }
});

// 格式化消息内容的方法
const formatMessage = (content) => {
  // 如果内容已经是HTML格式，直接返回
  if (content.includes('<p>')) {
    return content;
  }
  // 简单处理纯文本，将其包装在p标签中
  return `<p>${content}</p>`;
};

// 自动滚动到最新消息
import { ref, onUpdated } from 'vue';
const messageContainer = ref(null);

// 监听消息变化，自动滚动到底部
const scrollToBottom = () => {
  if (messageContainer.value) {
    const container = messageContainer.value;
    setTimeout(() => {
      container.scrollTop = container.scrollHeight;
    }, 50);
  }
};

onUpdated(scrollToBottom);
</script>

<template>
  <div class="chat-message" ref="messageContainer">
    <div class="message-container">
      <div v-for="(message, index) in messages" :key="index"
           :class="message.sender === 'user' ? 'message user-message' : 'message ai-message'">
        <div :class="message.sender === 'user' ? 'bubble user-bubble' : 'bubble ai-bubble'"
             :style="message.sender === 'user' ? { backgroundColor: themeColor } : null">
          <div v-if="message.isTyping" class="typing-indicator">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
          <div v-html="formatMessage(message.content)" :class="{ 'cursor': message.isTyping }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-message {
  border-bottom: 1px solid #dddddd;
  width: 100%;
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f9f9f9;
}

.message-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 100%;
  padding-bottom: 20px;
}

.message {
  display: flex;
  gap: 10px;
  max-width: 90%;
}

.user-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.ai-message {
  align-self: flex-start;
}

.avatar {
  min-width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
}

.user-avatar {
  background-color: #4a90e2;
}

.ai-avatar {
  background-color: #42b983;
}

.bubble {
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
  word-break: break-word;
  transition: opacity 0.3s ease;
}

.user-bubble {
  color: white;
  border-top-right-radius: 5px;
}

.ai-bubble {
  background-color: white;
  color: #333;
  border-top-left-radius: 5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.ai-bubble p {
  margin: 5px 0;
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
}

.dot {
  width: 6px;
  height: 6px;
  background-color: #666;
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
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-6px);
  }
}

.cursor::after {
  content: "|";
  animation: blink 1s infinite;
  color: #666;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style> 