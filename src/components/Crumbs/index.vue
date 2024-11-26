<template>
  <p class="backTitle flex_middle" @click="$router.push(path)">
    <el-icon><ArrowLeftBold /></el-icon>
    <span>{{title}}</span>
  </p>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  title: String,
  path: String
})
</script>

<style lang="scss">
.backTitle{
  font-size: 14px;
  cursor: pointer;
}
</style>