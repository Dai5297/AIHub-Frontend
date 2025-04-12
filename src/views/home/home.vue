<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="home-container">
    <h1 class="aihub-title">AIHub</h1>
    <div class="card-list">
      <el-row>
        <el-col :span="6">
          <RouterLink to="/main/ai" custom v-slot="{ navigate }">
            <el-card shadow="hover" @click="navigate" class="custom-card">
              <div class="card-icon">
                <el-icon><ChatDotRound /></el-icon>
              </div>
              <h2>AI 聊天</h2>
              <p>与智能AI助手进行自然对话</p>
            </el-card>
          </RouterLink>
        </el-col>
        <el-col :span="6">
          <RouterLink to="/main/medical" custom v-slot="{ navigate }">
            <el-card shadow="hover" @click="navigate" class="custom-card">
              <div class="card-icon">
                <el-icon><FirstAidKit /></el-icon>
              </div>
              <h2>医疗专家</h2>
              <p>提供专业的医疗咨询和诊断建议，助力健康生活。</p>
            </el-card>
          </RouterLink>
        </el-col>
        <el-col :span="6">
          <RouterLink to="/main/service" custom v-slot="{ navigate }">
            <el-card shadow="hover" @click="navigate" class="custom-card">
              <div class="card-icon">
                <el-icon><Van /></el-icon>
              </div>
              <h2>出行助手</h2>
              <p>智能规划行程，提供实时交通信息和旅行建议</p>
            </el-card>
          </RouterLink>
        </el-col>
        <el-col :span="6">
          <RouterLink to="/main/pdf" custom v-slot="{ navigate }">
            <el-card shadow="hover" @click="navigate" class="custom-card">
              <div class="card-icon">
                <el-icon><Document /></el-icon>
              </div>
              <h2>ChatPDF</h2>
              <p>智能文档阅读与问答系统</p>
            </el-card>
          </RouterLink>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  width: 100%;
  height: 100%;
}

.aihub-title {
  text-align: center; /* 水平居中 */
  font-family: 'Arial', sans-serif; /* 字体选择 */
  font-size: 50px; /* 字体大小 */
  color: #b2b4ea; /* 文字颜色 */
  letter-spacing: 2px; /* 字母间距 */
  line-height: 1.2; /* 行高 */
  padding-top: 50px; /* 上边距 */
}

.card-list {
  margin-top: 50px;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-card {
  margin: 50px;
  width: 300px;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平居中 */
  padding: 20px; /* 内部填充 */
  border-radius: 8px; /* 圆角 */
  background-color: #ffffff; /* 背景颜色 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  transition: transform 0.3s ease; /* 添加过渡效果 */
}

.custom-card:hover {
  transform: scale(1.05); /* 鼠标悬停时放大 */
  cursor: pointer; /* 更改鼠标指针为手形 */
}

.card-icon {
  text-align: center;
  font-size: 40px; /* 图标大小 */
  color: #1e90ff; /* 图标颜色 */
  margin-bottom: 20px; /* 图标与标题之间的间距 */
}

.custom-card h2 {
  text-align: center;
  margin-bottom: 10px; /* 标题与介绍之间的间距 */
  font-weight: bold; /* 加粗标题 */
  color: #333; /* 标题颜色 */
}

.custom-card p {
  text-align: center; /* 文本水平居中 */
  color: #666; /* 文字颜色 */
}
</style>
