<script setup>
import { Plus, FirstAidKit } from '@element-plus/icons-vue';
import ChatMessage from '@/components/ChatMessage.vue';
import ChatInput from '@/components/ChatInput.vue';
import ChatHistory from '@/components/ChatHistory.vue';
import { ref } from 'vue';


// 聊天历史记录数据
const histories = ref([
  {
    id: '100001',
    title: '问诊记录 100001'
  }
]);

// 示例消息数据
const messages = ref([
  {
    sender: 'ai',
    content: `<p>您好！我是您的AI医疗助手，您可以问我医疗相关问题</p>`
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
      content: `<p>收到您的描述：${message}</p><p>这是一个模拟的医疗AI响应。在实际应用中，这里会连接到专业的医疗知识库和诊断系统。</p>}</p>`
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
    title: `问诊记录 ${newId}`
  });
};
</script>

<template>
  <div class="chat-container">
    <ChatHistory 
      :histories="histories"
      theme-color="#42b983"
      @new-chat="handleNewChat"
    />
    <div class="chat-body">
      <ChatMessage 
        :messages="messages" 
        theme-color="#42b983"
      />
      <div class="input-section">
        <div class="search-options">
          <el-switch
            v-model="isOnlineSearch"
            active-text="在线问诊"
            inactive-text="离线问诊"
            inline-prompt
            style="--el-switch-on-color: #42b983; --el-switch-off-color: #909399;"
          />
        </div>
        <ChatInput 
          :loading="isLoading" 
          theme-color="#42b983"
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