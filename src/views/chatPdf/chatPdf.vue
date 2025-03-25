<script setup>
import { Plus, Document, Upload } from '@element-plus/icons-vue';
import ChatMessage from '@/components/ChatMessage.vue';
import ChatInput from '@/components/ChatInput.vue';
import ChatHistory from '@/components/ChatHistory.vue';
import { ref } from 'vue';

// 聊天历史记录数据
const histories = ref([
  {
    id: '300001',
    title: 'PDF对话 300001'
  }
]);

// 示例消息数据
const messages = ref([]);

// PDF文件状态
const currentPdf = ref(null);
const isLoading = ref(false);
const uploadRef = ref(null);

// 上传配置
const uploadConfig = {
  accept: '.pdf',
  'auto-upload': false,
  limit: 1
};

// 处理PDF上传
const handlePdfUpload = (file) => {
  if (file.type !== 'application/pdf') {
    ElMessage.error('只能上传PDF文件！');
    return false;
  }
  if (file.size / 1024 / 1024 > 10) {
    ElMessage.error('文件大小不能超过 10MB！');
    return false;
  }
  
  isLoading.value = true;
  // 模拟文件处理
  setTimeout(() => {
    currentPdf.value = {
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + 'MB'
    };
    
    // 添加系统消息
    messages.value.push({
      sender: 'ai',
      content: `<p>PDF文件"${file.name}"已成功上传并解析。</p>
                <p>现在您可以针对文档内容进行提问，我会帮您找到相关答案。</p>`
    });
    
    isLoading.value = false;
  }, 1500);
  
  return false; // 阻止自动上传
};

// 移除PDF
const handleRemovePdf = () => {
  currentPdf.value = null;
  messages.value = [];
};

const handleSendMessage = (message) => {
  if (!currentPdf.value) {
    ElMessage.warning('请先上传PDF文件！');
    return;
  }

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
      content: `<p>您询问的是关于"${currentPdf.value.name}"的问题：</p>
                <p>${message}</p>
                <p>这是一个模拟的PDF问答响应。在实际应用中，我会从PDF文档中检索相关内容来回答您的问题。</p>`
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
    title: `PDF对话 ${newId}`
  });
};
</script>

<template>
  <div class="chat-container">
    <ChatHistory 
      :histories="histories"
      theme-color="#ff6b6b"
      @new-chat="handleNewChat"
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
          <el-icon class="upload-icon"><Document /></el-icon>
          <div class="upload-text">
            <h3>将PDF文件拖到此处，或点击上传</h3>
            <p>单个文件不超过10MB</p>
          </div>
        </el-upload>
      </div>
      <div v-else class="pdf-info">
        <div class="pdf-details">
          <el-icon style="color: #ff6b6b"><Document /></el-icon>
          <span>{{ currentPdf.name }}</span>
          <span class="pdf-size">{{ currentPdf.size }}</span>
        </div>
        <el-button type="danger" link @click="handleRemovePdf">
          移除文件
        </el-button>
      </div>
      <ChatMessage 
        :messages="messages" 
        theme-color="#ff6b6b"
      />
      <div class="input-section">
        <ChatInput 
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
  color: #909399;
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
  color: #409eff;
}

.pdf-size {
  color: #909399;
  font-size: 13px;
  margin-left: 8px;
}

.input-section {
  border-top: 1px solid #eee;
  padding-top: 15px;
}
</style>