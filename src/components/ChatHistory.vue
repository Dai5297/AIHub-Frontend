<script setup>
import { Plus, ChatDotRound } from '@element-plus/icons-vue';

defineEmits(['new-chat']);

defineProps({
  histories: {
    type: Array,
    default: () => []
  },
  themeColor: {
    type: String,
    default: '#409eff'
  }
});
</script>

<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h3>聊天记录</h3>
      <el-button 
        :style="{ backgroundColor: themeColor, borderColor: themeColor }" 
        @click="$emit('new-chat')"
      >
        <el-icon><Plus /></el-icon>
        新增会话
      </el-button>
    </div>
    <div class="sidebar-body">
      <div class="history-item" v-for="(history, index) in histories" :key="index">
        <el-icon><ChatDotRound /></el-icon>
        {{ history.title }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 20%;
  border-radius: 15px;
  background-color: #fff;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dddddd;
  padding: 10px;
  height: 15%;
}

.sidebar-header h3 {
  font-family: 'Arial', sans-serif;
  letter-spacing: 1px;
  font-size: 1.5em;
  font-weight: bolder;
  padding-left: 10px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.sidebar-body {
  height: calc(85% - 1px);
  overflow-y: auto;
  padding: 10px;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 5px;
  background-color: #f0f8ff;
  border-radius: 10px;
  height: 50px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.history-item i {
  margin-right: 10px;
  color: #6c757d;
}

.history-item:hover {
  background-color: #e6f7ff;
}
</style> 