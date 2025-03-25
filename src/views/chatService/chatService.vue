<script setup>
import { Plus, Service } from '@element-plus/icons-vue';
import ChatMessage from '@/components/ChatMessage.vue';
import ChatInput from '@/components/ChatInput.vue';
import ChatHistory from '@/components/ChatHistory.vue';
import { ref } from 'vue';

// 聊天历史记录数据
const histories = ref([
  {
    id: '200001',
    title: '服务记录 200001'
  }
]);

// 示例消息数据
const messages = ref([
  {
    sender: 'ai',
    content: `<p>我是您的智能客服助手，将竭诚为您解答问题。</p>`
  }
]);

const isLoading = ref(false);

const handleSendMessage = (message) => {
  // 添加用户消息
  messages.value.push({
    sender: 'user',
    content: message
  });
  
  // 模拟AI响应
  isLoading.value = true;
  setTimeout(() => {
    messages.value.push({
      sender: 'ai',
      content: `<p>我是您的智能客服助手，将竭诚为您解答问题。</p>`
    });
    isLoading.value = false;
  }, 1000);
};

const handleClearChat = () => {
  messages.value = [];
};

const handleNewChat = () => {
  const newId = Date.now().toString().slice(-6);
  histories.value.push({
    id: newId,
    title: `服务记录 ${newId}`
  });
};
</script>

<template>
  <div class="chat-container">
    <ChatHistory 
      :histories="histories"
      theme-color="#ed3de5"
      @new-chat="handleNewChat"
    />
    <div class="chat-body">
      <ChatMessage 
        :messages="messages" 
        theme-color="#ed3de5"
      />
      <div class="input-section">
        <ChatInput 
          :loading="isLoading" 
          theme-color="#ed3de5"
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
  padding-top: 15px;
}
</style>