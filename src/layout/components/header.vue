<template>
  <el-header>
    <div class="left">
      <div class="logo" />
      <!-- {{ props.info.mediationCenterName }} -->
    </div>
    <div class="right">
      <Message @new-msg-come="emit('new-msg-come')" />
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img src="@/assets/img/avatar.png" class="user-avatar" />
          <span class="user-name">{{ props.info.userRealName }}</span>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu class="user-dropdown">
            <el-dropdown-item @click="onChangePwd">修改密码</el-dropdown-item>
            <el-dropdown-item @click="onLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup>
import { onMounted } from 'vue'
import { sensorsList } from '@/utils/sensors'
import Message from './message.vue'
import { getFirstLogin } from '@/utils/auth'

const emit = defineEmits(['new-msg-come'])

const props = defineProps({ info: Object })
const curtPath = window.location.href
const onLogout = () => {
  window.location.href = 'https://admin.huixtj.com/home?loginout=true'
}

// 修改密码跳转
const onChangePwd = () => {
  window.location.href = `https://admin.huixtj.com/login?returnUrl=${curtPath}&changepwd=true`
}

onMounted(() => {
  const isFirstLogin =  getFirstLogin()
  if (isFirstLogin == 'true') {
    window.location.href = `https://admin.huixtj.com/login?returnUrl=${curtPath}&changepwd=true`
  }
})
</script>

<style lang="scss" scoped>
.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .logo {
    height: 17px;
    background-image: url(../../assets/img/logo.png);
    background-size: 184px 17px;
    background-position: 32px center;
    background-repeat: no-repeat;
    width: 220px;
  }
  .avatar-container {
    .avatar-wrapper {
      display: flex;
      align-items: center;
      margin-right: 24px;
      color: $label;
      cursor: pointer;

      .user-avatar {
        margin-right: 8px;
        width: 24px;
        height: 24px;
        border-radius: 12px;
      }

      .user-name {
        margin-right: 8px;
        font-size: 14px;
        color: #616b78;
      }

      .icon {
        transform: translateY(1px);
        font-size: 12px;
      }
    }
  }
  .left {
    display: flex;
    line-height: $headerHeight;
    color: #7b99c1;
  }
  .right {
    display: flex;
    align-items: center;
  }
}

@keyframes callRotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(45deg);
  }
}
</style>
