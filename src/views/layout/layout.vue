<script setup>
import { onMounted, ref } from 'vue'
import { User } from '@element-plus/icons-vue'
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
        <div class="logo">
          <RouterLink to="/main">
            <img src="@/assets/logo.png" alt="AIHub Logo" class="logo-img" />
          </RouterLink>
        </div>
        <el-dropdown class="user">
          <span class="el-dropdown-link">
            <el-icon><User /></el-icon>
            <span class="username">{{ username }}</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="dialogFormVisible = true">修改密码</el-dropdown-item>
              <el-dropdown-item @click="handleLogout()" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
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
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: center; /* 垂直居中 */
  background-color: #8091b1;
  padding: 10px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.logo a {
  display: inline-flex;
  align-items: center;
  width: 200px; /* 增加宽度 */
}

.logo-img {
  width: 100%;
  height: auto;
  max-height: 150px; /* 增加最大高度 */
  object-fit: contain;
  padding: 5px 0; /* 添加垂直内边距 */
}

.user {
  cursor: pointer;
  margin-right: 15px;
}

.el-dropdown-link {
  color: white;
  font-size: 16px;
  outline: none;
  display: flex;
  align-items: center; /* 垂直居中 */
  gap: 5px; /* 图标和文字之间的间距 */
}

.username {
  margin: 5px;
}

.main {
  background-color: #efefef;
  height: calc(100vh - 64px); /* 计算主内容区域的高度，减去头部高度 */
  overflow-y: auto; /* 主内容区域添加垂直滚动条 */
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
