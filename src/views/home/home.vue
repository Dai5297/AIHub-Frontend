<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="home-container">
    <div class="hero-section">
      <h1 class="aihub-title">AIHub</h1>
      <p class="subtitle">智能助手平台</p>
    </div>
    <div class="card-list">
      <el-row :gutter="30">
        <el-col :xs="24" :sm="12" :md="6" :lg="6">
          <RouterLink to="/main/ai" custom v-slot="{ navigate }">
            <div class="feature-card" @click="navigate">
              <div class="card-icon">
                <el-icon><ChatDotRound /></el-icon>
              </div>
              <div class="card-content">
                <h2>AI 聊天</h2>
                <p>与智能AI助手进行自然对话</p>
              </div>
            </div>
          </RouterLink>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6">
          <RouterLink to="/main/medical" custom v-slot="{ navigate }">
            <div class="feature-card" @click="navigate">
              <div class="card-icon">
                <el-icon><FirstAidKit /></el-icon>
              </div>
              <div class="card-content">
                <h2>医疗专家</h2>
                <p>提供专业的医疗咨询和诊断建议，助力健康生活。</p>
              </div>
            </div>
          </RouterLink>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6">
          <RouterLink to="/main/service" custom v-slot="{ navigate }">
            <div class="feature-card" @click="navigate">
              <div class="card-icon">
                <el-icon><Van /></el-icon>
              </div>
              <div class="card-content">
                <h2>出行助手</h2>
                <p>智能规划行程，提供实时交通信息和旅行建议</p>
              </div>
            </div>
          </RouterLink>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6">
          <RouterLink to="/main/pdf" custom v-slot="{ navigate }">
            <div class="feature-card" @click="navigate">
              <div class="card-icon">
                <el-icon><Document /></el-icon>
              </div>
              <div class="card-content">
                <h2>ChatPDF</h2>
                <p>智能文档阅读与问答系统</p>
              </div>
            </div>
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
  background: linear-gradient(135deg, #f5f7fa 0%, #e4ecfb 100%);
  padding: 2rem;
}

.hero-section {
  text-align: center;
  padding: 4rem 0;
}

.aihub-title {
  font-family: 'Inter', 'Arial', sans-serif;
  font-size: 4rem;
  font-weight: 700;
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  letter-spacing: -1px;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.5rem;
  color: #718096;
  margin-bottom: 2rem;
}

.card-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.feature-card {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  height: 100%;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  margin-bottom: 2rem;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.feature-card:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  background: rgba(71, 118, 230, 0.1);
  border-radius: 50%;
  margin-bottom: 1.5rem;
}

.card-icon .el-icon {
  font-size: 2rem;
  color: #4776E6;
}

.card-content {
  flex: 1;
}

.feature-card h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.feature-card p {
  font-size: 1rem;
  color: #718096;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .aihub-title {
    font-size: 3rem;
  }
  
  .subtitle {
    font-size: 1.2rem;
  }
  
  .feature-card {
    padding: 1.5rem;
  }
}
</style>
