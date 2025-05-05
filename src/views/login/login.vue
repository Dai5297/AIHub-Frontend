<script setup>
import { ref } from 'vue'
import { User, Lock, Monitor } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/login.js'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loginForm = ref({
  username: 'admin',
  password: '123456',
})

const handleLogin = async () => {
  const res = await login(loginForm.value)
  if (res.code === 200) {
    localStorage.setItem('Authorization', res.data.token)
    await router.push('/main')
  } else {
    ElMessage.error(res.msg)
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <img src="@/assets/logo-removebg-preview.png" alt="AIHub Logo" class="logo" />
        <h2>欢迎登录 AIHub</h2>
        <p>智能对话，无限可能</p>
      </div>
      <div class="login-form">
        <el-form :model="loginForm" class="form">
          <el-form-item>
            <el-input v-model="loginForm.username" placeholder="用户名" :prefix-icon="User" />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <el-button class="login-button" @click="handleLogin"> 登录 </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="login-footer">
      <div class="footer-content">
        <div class="beian-info">
          <el-icon class="beian-icon"><Monitor /></el-icon>
          <a href="http://beian.miit.gov.cn/" target="_blank" class="beian-link"
            >闽ICP备2025097025号-1</a
          >
        </div>
        <div class="copyright">© {{ new Date().getFullYear() }} AIHub. All Rights Reserved.</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-box {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  width: 120px;
  height: auto;
  margin-bottom: 20px;
}

.login-header h2 {
  color: #303133;
  font-size: 24px;
  margin-bottom: 10px;
  font-weight: 600;
}

.login-header p {
  color: #909399;
  font-size: 14px;
}

.login-form {
  margin-top: 30px;
}

.form :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6;
  border-radius: 8px;
  padding: 8px 15px;
}

.form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #409eff;
}

.form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff;
}

.login-button {
  width: 100%;
  height: 40px;
  background: #409eff;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-button:hover {
  background: #66b1ff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.login-button:active {
  transform: translateY(0);
}

/* 页脚样式 */
.login-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 4px 0;
  background-color: rgba(245, 247, 250, 0.8);
  text-align: center;
  font-size: 11px;
  color: #909399;
  border-top: 1px solid #e4e7ed;
  height: 30px; /* 固定高度为30px */
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-content {
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-direction: row; /* 改为水平排列 */
  align-items: center;
  justify-content: center; /* 确保内容居中 */
  gap: 10px;
}

.beian-info {
  display: flex;
  align-items: center;
  justify-content: center;
}

.beian-icon {
  margin-right: 3px;
  font-size: 11px;
  color: #909399;
}

.beian-link {
  color: #909399;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  padding: 1px 2px;
  border-radius: 3px;
  font-size: 11px;
}

.beian-link:hover {
  color: #409eff;
  background-color: rgba(64, 158, 255, 0.1);
}

.copyright {
  font-size: 10px;
  color: #a0a0a0;
  margin-top: 2px;
}
</style>
