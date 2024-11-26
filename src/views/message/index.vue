<template>
  <div class="msg-center">
    <el-checkbox v-model="unreadOnly" label="只看未读" @change="onChange" />
    <TablePage ref="tablePage" :data="config" />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import { TablePage } from '@lcode/components-vue3'
import config from './config'
import { sensorsList } from '@/utils/sensors'

const unreadOnly = ref(true)
const tablePage = ref()

const onChange = value => {
  tablePage.value.onSearch()
  if(value){
    sensorsList.huixtj_dataQuery_allocation_confirm_2()
  }else{
    sensorsList.huixtj_dataQuery_allocation_fail_2()
  }
}

provide('pageNode', {
  unreadOnly
})
</script>

<style lang="scss">
.msg-center {
  position: relative;
  > .el-checkbox {
    position: absolute;
    right: 2px;
    top: 0;
    font-weight: normal;
    line-height: 14px;
    color: #3d3d3d;
  }
  .msg-unread {
    position: relative;
    &::before {
      position: absolute;
      content: '';
      width: 4px;
      height: 4px;
      border-radius: 2px;
      background: #ff4545;
      left: -6px;
      top: 2px;
    }
  }
  .msg-content {
    > a {
      color: #399ffd;
    }
  }
}
</style>
