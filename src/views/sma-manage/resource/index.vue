<template>
  <div>
    <TablePage ref="tablePage" :data="config" />
    <el-dialog v-model="previewVisible" title="查看" destroy-on-close>
      <div class="carousel-item" v-for="(item, index) in previewData" :key="index">
        <el-image v-if="imgExp.test(item.ext)" style="width: 100%;height: 100%;"
          :src="item.src" :preview-src-list="[item.src]" fit="contain" :preview-teleported="true" />
        <audio :src="item.src" v-else-if="audioExp.test(item.ext)" controls
          style="width: 600px;height: 60px;"></audio>
        <video preload="auto" style="width: 600px;height: auto;object-fit: cover;"
          v-else-if="videoExp.test(item.ext)" controls>
          <source style="width: 600px;height: auto;" :src="item.src" type="video/mp4" />
        </video>
        <div v-else style="text-align: center;">
          <p style="margin-bottom: 8px; color: #999;">该文件不支持查看</p>
          <el-button type="primary" @click="onDownload(item.url)">下载文件</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { TablePage } from '@lcode/components-vue3'
import config from './config'
import { provide, ref } from 'vue';
import ResourceApi from '@/api/resource'

const imgExp = /(jpg|jpeg|png|gif|webp|svg|bmp|ico)/i
const audioExp = /(mp3|wav|aac|flac|aif|aiff|wma)/i
const videoExp = /(mp4|ogg|avi|mov|wmv|flv|mkv|webm|m4v|rmvb|3gp|asf|asx)/i

const previewVisible = ref(false)
const previewData = ref([])
const onDownload = async (url) => {
  ResourceApi.downloadFile(url, false)
}

const onPreview = async (url) => {
  const ext = '.' + /\$(.*)\$/i.exec(url)[1]
  if (imgExp.test(url) || audioExp.test(url) || videoExp.test(url)) {
    const result = await ResourceApi.downloadFile(url)
    const src = URL.createObjectURL(result.result)
    previewData.value = [{ url, src, ext }]
  } else {
    previewData.value = [{ url, ext }]
  }
  previewVisible.value = true
}

provide('pageNode', {
  onPreview,
  onDownload
})
</script>

<style lang="scss" scoped>
  .carousel-item {
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
