<script setup>
import { Plus, ChatDotRound, User } from '@element-plus/icons-vue';
import ChatMessage from '@/components/ChatMessage.vue';
import ChatInput from '@/components/ChatInput.vue';
import ChatHistory from '@/components/ChatHistory.vue';
import { ref } from 'vue';

const isOnlineSearch = ref(true);

// 聊天历史记录数据
const histories = ref([
  {
    id: '608866',
    title: '对话 608866'
  }
]);

// 示例消息数据
const messages = ref([
  {
    sender: 'ai',
    content: `<p>您好, 我是你的AI智能助手，有什么我能帮助你的吗</p>`
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
      content: `<p>您询问的是: "${message}"</p><p>这是一个模拟的AI响应。在实际应用中，这里会连接到后端API获取真实的AI回复。</p><p>当前搜索模式: ${isOnlineSearch.value ? '在线搜索' : '离线搜索'}</p>`
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
    title: `对话 ${newId}`
  });
};
</script>

<template>
  <div class="chat-container">
    <ChatHistory 
      :histories="histories"
      theme-color="#409eff"
      @new-chat="handleNewChat"
    />
    <div class="chat-body">
      <ChatMessage 
        :messages="messages" 
        theme-color="#409eff"
      />
      <div class="input-section">
        <div class="search-options">
          <el-switch
            v-model="isOnlineSearch"
            active-text="在线搜索"
            inactive-text="离线搜索"
            inline-prompt
            style="--el-switch-on-color: #409eff; --el-switch-off-color: #909399;"
          />
        </div>
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
</style>
