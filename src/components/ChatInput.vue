<script setup>
import { ref } from 'vue'
import { Position } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '请输入您的问题...',
  },
  themeColor: {
    type: String,
    default: '#409eff',
  },
})

const emit = defineEmits(['send', 'clear'])

const inputMessage = ref('')

const sendMessage = () => {
  if (!inputMessage.value.trim() || props.disabled) {
    ElMessage.error('请输入您的问题')
    return
  }
  emit('send', inputMessage.value)
  inputMessage.value = ''
}

const clearChat = () => {
  emit('clear')
}
</script>

<template>
  <div class="chat-input">
    <div class="input-container">
      <el-input
        v-model="inputMessage"
        type="textarea"
        :rows="2"
        :placeholder="placeholder"
        :disabled="disabled"
        resize="none"
        @keyup.enter.ctrl="sendMessage"
      />
      <div class="input-tools">
        <el-tooltip content="发送消息 (Ctrl+Enter)">
          <el-button
            :style="{ backgroundColor: themeColor, borderColor: themeColor }"
            class="round-button"
            :loading="loading"
            :disabled="disabled"
            @click="sendMessage"
          >
            <el-icon v-if="!loading"><Position /></el-icon>
            <span v-else class="loading-text">处理中</span>
          </el-button>
        </el-tooltip>
      </div>
    </div>
    <div class="input-footer">
      <span class="footer-tip">按 Ctrl+Enter 发送</span>
      <el-button
        link
        size="small"
        :disabled="disabled"
        :style="{ color: themeColor }"
        @click="clearChat"
      >
        清空会话
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.chat-input {
  width: 100%;
  padding: 0 10px 10px;
  background-color: #fff;
}

.input-container {
  display: flex;
  gap: 10px;
  align-items: center;
}

.input-container .el-input {
  flex-grow: 1;
}

.input-container :deep(.el-textarea__inner) {
  border-radius: 8px;
  resize: none;
  min-height: 40px !important;
  max-height: 40px !important;
  padding: 8px 12px;
  line-height: 24px;
  box-shadow: 0 0 0 1px #dcdfe6;
}

.input-container :deep(.el-textarea__inner:disabled) {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
}

.input-tools {
  display: flex;
  align-items: center;
}

.round-button {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.round-button:hover {
  opacity: 0.9;
}

.round-button :deep(.el-icon) {
  font-size: 20px;
  color: white;
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 5px 0;
}

.footer-tip {
  color: #909399;
  font-size: 12px;
}

.loading-text {
  font-size: 12px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
