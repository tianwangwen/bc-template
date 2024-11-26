<template>
  <div class="message-list">
    <div class="notification" @click="showNotify">
      <el-icon><Comment /></el-icon>
      <em v-show="num > 0" class="notification-num">{{ num }}</em>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, h, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from "vue-router";
import { ElNotification } from 'element-plus'
import MessageApi from '@/api/message'
import { sensorsList } from '@/utils/sensors'

const store = useStore()
const messageData = ref({})

const router = useRouter()
const showNotify = () => {
  router.push({ name: 'MessageList' })
  sensorsList.sfzc_message()
}

const num = computed({
  get() {
    return store.state.app.notifyNum;
  },
  set(value) {
    store.commit('app/setNotifyNum', value)
  }
})

const downloadFile = () => {
  MessageApi.downloadFailFile({ msgId: messageData.value.msgId })
}

const getData = async () => {
  const result = await MessageApi.sysMessageRemind()
  setTimeout(() => {
    getData()
  }, 60000)
  if (!result) return
  messageData.value = result
  num.value = result.count
  if (result.content) {
    ElNotification({
      title: '消息',
      message: h('div', {}, [
        h('p', {}, [
          h('span', {}, result.content || '123'),
          result.msgType === 3 ? h('span', { onClick: downloadFile, style: { 'color': '#08979c', 'cursor': 'pointer', 'margin-left': '4px' } }, '失败记录') : ''
        ]),
        h('p', { style: { 'text-align': 'right', 'color': '#08979c', 'cursor': 'pointer' }, onClick: showNotify }, '查看详情')
      ]),
      position: 'bottom-right',
    })
  }
}

onMounted(() => {
  getData()
})

</script>

<style lang="scss" scoped>
.message-list {
  .notification {
    position: relative;
    padding: 0 15px;
    margin-right: 28px;
    color: white;
    cursor: pointer;
    & > i {
      color: $label;
    }
    &-num {
      position: absolute;
      top: -4px;
      left: 25px;
      height: 14px;
      line-height: 12px;
      font-size: 12px;
      font-style: normal;
      padding: 0 4px;
      background-color: #ff7a37;
      border-radius: 7px;
      border: 1px solid white;
    }
  }
}
</style>