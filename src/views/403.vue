<template>
  <div>暂无权限<el-button type="primary" link @click="onLogout">退出</el-button></div>
</template>

<script setup>
import { login, removeToken } from '@/utils/auth'
const onLogout = () => {
  removeToken()
  login()
}
</script>
