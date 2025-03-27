<script setup>
import {Plus, ChatDotRound} from '@element-plus/icons-vue';

defineEmits(['new-chat', 'change-chat']);

defineProps({
  histories: {
    type: Array,
    default: () => []
  },
  themeColor: {
    type: String,
    default: '#409eff'
  },
  currentChatId: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h3>聊天记录</h3>
      <el-button
          :style="{ backgroundColor: themeColor, borderColor: themeColor }"
          class="new-chat"
          @click="$emit('new-chat')"
      >
        <el-icon>
          <Plus/>
        </el-icon>
        新增会话
      </el-button>
    </div>
    <div class="sidebar-body">
      <div 
        class="history-item" 
        v-for="(history, index) in histories" 
        :key="index" 
        @click="$emit('change-chat', history.id)" 
        :class="{'active-history-item': history.id === currentChatId}"
        :style="[
          { backgroundColor: history.id === currentChatId ? `${themeColor}30` : `${themeColor}10` },
          history.id === currentChatId ? { borderColor: themeColor } : {}
        ]"
      >
        <el-icon :style="{ color: history.id === currentChatId ? themeColor : `${themeColor}90` }">
          <ChatDotRound/>
        </el-icon>
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

.new-chat:hover {
  color: #fff;
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
  border-radius: 10px;
  height: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.active-history-item {
  font-weight: bold;
}

.history-item i {
  margin-right: 10px;
}

.history-item:hover {
  filter: brightness(0.95);
}
</style> 