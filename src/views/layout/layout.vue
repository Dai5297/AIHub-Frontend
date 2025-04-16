<script setup>
import { onMounted, ref } from 'vue'
import { User, Key, SwitchButton } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { RouterLink } from 'vue-router'
import { getUserDetail, changePassword } from '@/api/layout.js'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')

const dialogFormVisible = ref(false)

const form = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const formLabelWidth = '140px'

const handleChangePassword = async () => {
  if (!form.value.oldPassword || !form.value.newPassword || !form.value.confirmPassword) {
    ElMessage.error('请填写完整信息')
    return
  }
  if (form.value.newPassword !== form.value.confirmPassword) {
    ElMessage.error('新密码与确认密码不一致')
    return
  }
  const res = await changePassword(form.value)
  if (res.code === 200) {
    ElMessage.success('修改密码成功')
    dialogFormVisible.value = false
  } else {
    ElMessage.error(res.msg)
  }
}

const handleLogout = async () => {
  localStorage.removeItem('Authorization')
  ElMessage.success('退出登录成功')
  await router.push('/login')
}

const getUsrDetail = async () => {
  const res = await getUserDetail()
  if (res.code === 200) {
    username.value = res.data.username
  } else {
    ElMessage.error(res.msg)
    await router.push('/login')
  }
}

onMounted(getUsrDetail)
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header class="head">
        <div class="header-container">
          <div class="logo">
            <RouterLink to="/main">
              <img src="@/assets/logo.png" alt="AIHub Logo" class="logo-img" />
              <span class="logo-text">AIHub</span>
            </RouterLink>
          </div>
          <div class="header-right">
            <div class="nav-links">
              <RouterLink to="/main" class="nav-link" exact>首页</RouterLink>
              <RouterLink to="/main/ai" class="nav-link">AI聊天</RouterLink>
              <RouterLink to="/main/medical" class="nav-link">医疗专家</RouterLink>
              <RouterLink to="/main/service" class="nav-link">出行助手</RouterLink>
              <RouterLink to="/main/pdf" class="nav-link">PDF助手</RouterLink>
            </div>
            <el-dropdown class="user-menu">
              <div class="user-avatar">
                <el-icon class="avatar-icon"><User /></el-icon>
                <span class="username">{{ username }}</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="dialogFormVisible = true">
                    <el-icon><Key /></el-icon>
                    <span>修改密码</span>
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleLogout()" divided>
                    <el-icon><SwitchButton /></el-icon>
                    <span>退出登录</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-main class="main">
        <!--主体界面-->
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>

        <!--修改密码-->
        <el-dialog v-model="dialogFormVisible" title="修改密码" width="500" align-center center>
          <el-form :model="form">
            <el-form-item label="请输入原始密码" :label-width="formLabelWidth" required>
              <el-input v-model="form.oldPassword" autocomplete="off" type="password" />
            </el-form-item>
            <el-form-item label="请输入新密码" :label-width="formLabelWidth" required>
              <el-input v-model="form.newPassword" autocomplete="off" type="password" />
            </el-form-item>
            <el-form-item label="请确认新密码" :label-width="formLabelWidth" required>
              <el-input v-model="form.confirmPassword" autocomplete="off" type="password" />
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取消</el-button>
              <el-button type="primary" @click="handleChangePassword()"> 确认 </el-button>
            </div>
          </template>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.common-layout {
  height: 100vh; /* 设置容器高度为视口高度 */
  overflow: hidden; /* 防止内部内容溢出 */
  user-select: none; /* 禁止选中内容 */
}

/* 全局禁止内容选中 */
:deep(*) {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.head {
  padding: 0;
  background-color: #ffffff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 10;
  height: 64px;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}

.logo {
  display: flex;
  align-items: center;
}

.logo a {
  display: inline-flex;
  align-items: center;
  height: 60px;
  padding: 5px 0;
  text-decoration: none;
}

.logo-img {
  height: 90px;
  width: auto;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.logo-text {
  font-size: 24px;
  font-weight: 600;
  margin-left: 10px;
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo a:hover .logo-img {
  transform: scale(1.05);
}

.header-right {
  display: flex;
  align-items: center;
}

.nav-links {
  display: flex;
  margin-right: 30px;
}

.nav-link {
  padding: 0 15px;
  font-size: 15px;
  font-weight: 500;
  color: #606266;
  text-decoration: none;
  line-height: 64px;
  transition: all 0.3s;
  position: relative;
}

.nav-link:hover {
  color: #4776E6;
}

.nav-link:hover::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 15px;
  width: calc(100% - 30px);
  height: 3px;
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  border-radius: 3px 3px 0 0;
}

/* 选中样式 */
.nav-link.router-link-active {
  color: #4776E6;
  font-weight: 600;
}

.nav-link.router-link-exact-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 15px;
  width: calc(100% - 30px);
  height: 3px;
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  border-radius: 3px 3px 0 0;
}

/* 首页特殊处理 */
a[href="/main"].nav-link {
  color: #606266;
  font-weight: 500;
}

a[href="/main"].nav-link.router-link-exact-active {
  color: #4776E6;
  font-weight: 600;
}

a[href="/main"].nav-link::after {
  display: none;
}

a[href="/main"].router-link-exact-active::after {
  display: block;
}

.user-menu {
  cursor: pointer;
}

.user-avatar {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  background-color: #f5f7fa;
  transition: all 0.3s;
}

.user-avatar:hover {
  background-color: #e6e8eb;
}

.avatar-icon {
  font-size: 18px;
  color: #8E54E9;
  margin-right: 6px;
}

.username {
  font-size: 14px;
  color: #2d3748;
  font-weight: 500;
}

.main {
  background-color: #f5f7fa;
  height: calc(100vh - 64px); /* 计算主内容区域的高度，减去头部高度 */
  overflow-y: auto; /* 主内容区域添加垂直滚动条 */
}

/* 下拉菜单样式 */
:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  padding: 8px 16px;
}

:deep(.el-dropdown-menu__item .el-icon) {
  margin-right: 8px;
  font-size: 16px;
}

/* 路由切换动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.5s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
