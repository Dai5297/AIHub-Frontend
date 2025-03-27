<script setup>
import {ElMessage} from "element-plus";
import {Document, Upload} from '@element-plus/icons-vue';
import ChatMessage from '@/components/ChatMessage.vue';
import ChatInput from '@/components/ChatInput.vue';
import ChatHistory from '@/components/ChatHistory.vue';
import {ref, onMounted} from 'vue';
import {sendMessage, getChatTitle, getDetailHistory, getChatHistory, uploadPdfFile} from "@/api/chatPdf.js";

// 聊天历史记录数据
const histories = ref([
  {
    id: '300001',
    title: '新对话'
  }
]);

const isFirstMessage = ref();
const currentChatId = ref('300001');

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

// 打字机效果函数
const addStreamingMessage = (content) => {
  const aiMessage = {
    sender: 'ai',
    content: '',
    isTyping: true
  };
  messages.value.push(aiMessage);

  let index = 0;
  const intervalId = setInterval(() => {
    if (index < content.length) {
      aiMessage.content += content.charAt(index);
      index++;
      // 强制触发数组更新（解决 Vue 3 响应式丢失问题）
      messages.value = [...messages.value];
    } else {
      aiMessage.isTyping = false; // 关键：更新状态
      messages.value = [...messages.value]; // 再次触发更新
      clearInterval(intervalId);
    }
  }, 30); // 调整速度为 30ms/字符
};

// 处理PDF上传
const handlePdfUpload = async (file) => {
  // 检查文件类型，更可靠的检查方式
  const isPdf = file.type === 'application/pdf' || 
               (file.name && file.name.toLowerCase().endsWith('.pdf'));
  
  if (!isPdf) {
    ElMessage.error('只能上传PDF文件！');
    return false;
  }

  if (file.size / 1024 / 1024 > 10) {
    ElMessage.error('文件大小不能超过 10MB！');
    return false;
  }

  isLoading.value = true;
  
  try {
    // 创建FormData对象用于上传文件
    const formData = new FormData();
    formData.append('file', file.raw || file); // 使用原始文件对象
    formData.append('chatId', currentChatId.value);
    
    // 调用上传文件API
    const res = await uploadPdfFile(formData);
    
    if (res.code === 200) {
      // 上传成功，更新当前PDF信息
      currentPdf.value = {
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + 'MB',
        url: res.data.url || '' // 如果后端返回了URL，保存下来
      };
      
      // 添加系统消息
      addStreamingMessage(`<p>PDF文件"${file.name}"已成功上传并解析。</p>
                  <p>现在您可以针对文档内容进行提问，我会帮您找到相关答案。</p>`);
      
      // 如果是第一次上传，可以请求生成标题
      if (isFirstMessage.value) {
        const titleRes = await getChatTitle();
        if (titleRes.code === 200) {
          histories.value.forEach(item => {
            if (item.title === '新对话') {
              item.title = titleRes.data.title;
            }
          });
        } else {
          ElMessage.error('获取对话标题失败');
        }
        isFirstMessage.value = false;
      }
    } else {
      ElMessage.error(res.msg || '上传失败，请稍后重试');
    }
  } catch (error) {
    console.error('文件上传错误:', error);
    ElMessage.error('文件上传过程中发生错误，请稍后重试');
  } finally {
    isLoading.value = false;
  }

  return false; // 阻止自动上传
};

// 移除PDF
const handleRemovePdf = () => {
  currentPdf.value = null;
  messages.value = [];
};

// 发送消息
const handleSendMessage = async (message) => {
  if (!currentPdf.value) {
    ElMessage.warning('请先上传PDF文件！');
    return;
  }

  if (messages.value.length === 1) {
    isFirstMessage.value = true;
  }

  // 添加用户消息
  messages.value.push({
    sender: 'user',
    content: message
  });

  isLoading.value = true;

  // 调用 API 发送消息
  const data = {
    message: message,
    pdfName: currentPdf.value ? currentPdf.value.name : '',
    chatId: currentChatId.value
  };

  try {
    const res = await sendMessage(data);
    if (res.code === 200) {
      addStreamingMessage(res.data.content);
    } else {
      ElMessage.error(res.msg || '请求失败，请稍后重试');
    }
  } catch (error) {
    ElMessage.error('网络错误，请稍后重试');
    console.error(error);
  } finally {
    isLoading.value = false;
  }

  // 如果为第一个对话则发送请求获取对话标题
  if (isFirstMessage.value) {
    const res = await getChatTitle();
    if (res.code === 200) {
      histories.value.forEach(item => {
        if (item.title === '新对话') {
          item.title = res.data.title;
        }
      });
    } else {
      ElMessage.error('请求失败，请稍后重试');
    }
    isFirstMessage.value = false;
  }
};

// 清空对话
const handleClearChat = () => {
  messages.value = [];
};

// 创建新对话
const handleNewChat = () => {
  if (histories.value.some(item => item.title === '新对话')) {
    ElMessage.error('您已经创建了一个新的对话');
    return;
  }
  const newId = Date.now().toString().slice(-6);
  currentChatId.value = newId;
  histories.value.push({
    id: newId,
    title: `新对话`
  });
  messages.value = [];
  currentPdf.value = null;
};

// 切换对话
const handleChangeChat = async (id) => {
  currentChatId.value = id;
  const res = await getDetailHistory(id);
  if (res.code === 200) {
    messages.value = res.data.messages;
    if (res.data.pdf) {
      currentPdf.value = res.data.pdf;
    } else {
      currentPdf.value = null;
    }
  } else {
    ElMessage.error('请求失败，请稍后重试');
  }
};

// 获取对话信息
const getHistorty = async () => {
  const res = await getChatHistory();
  if (res.code === 200) {
    histories.value = res.data;
    if (res.data.length > 0) {
      currentChatId.value = res.data[0].id;
      const resDetail = await getDetailHistory(res.data[0].id);
      if (resDetail.code === 200) {
        messages.value = resDetail.data.messages;
        if (resDetail.data.pdf) {
          currentPdf.value = resDetail.data.pdf;
        }
      } else {
        ElMessage.error('请求失败，请稍后重试');
      }
    }
  } else {
    ElMessage.error('请求失败，请稍后重试');
  }
};

onMounted(async () => {
  await getHistorty();
  if (messages.value.length === 0) {
    isFirstMessage.value = true;
  }
});
</script>

<template>
  <div class="chat-container">
    <ChatHistory
        :histories="histories"
        :current-chat-id="currentChatId"
        theme-color="#ff6b6b"
        @new-chat="handleNewChat"
        @change-chat="handleChangeChat"
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
          <el-icon class="upload-icon" style="color: #ff6b6b">
            <Document/>
          </el-icon>
          <div class="upload-text">
            <h3>将PDF文件拖到此处，或点击上传</h3>
            <p>单个文件不超过10MB</p>
          </div>
        </el-upload>
      </div>
      <div v-else class="pdf-info">
        <div class="pdf-details">
          <el-icon style="color: #ff6b6b">
            <Document/>
          </el-icon>
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
            style="margin-top: 20px;"
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
}

.pdf-size {
  color: #909399;
  font-size: 13px;
  margin-left: 8px;
}

.input-section {
  border-top: 1px solid #eee;
}
</style>