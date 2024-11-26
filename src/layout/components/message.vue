<template>
  <div class="message">
    <div class="message-icon" @click="toMessage" />
    <span v-if="num > 0" class="message-num">{{ num }}</span>
  </div>
</template>

<script setup>
import { onMounted, ref, h, computed, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElNotification, ElButton } from 'element-plus'
import MessageApi from '@/api/message'
import { sensorsList } from '@/utils/sensors'

const store = useStore()
const router = useRouter()

const timer = ref(null)

const emit = defineEmits(['new-msg-come'])

const onOpen = () => {
  router.push({ name: 'Message' })
}

const toMessage = () => {
  onOpen()
  sensorsList.huixtj_dataQuery_allocation_2()
}

const onMessage = () => {
  onOpen()
  sensorsList.huixtj_dataQuery_rule_confirm_2()
}

const num = computed({
  get() {
    return store.state.app.messageNum
  },
  set(value) {
    store.commit('app/setMessageNum', value)
  }
})

const getData = async () => {
  const result = await MessageApi.unreadCount()
  timer.value && clearTimeout(timer.value);
  timer.value = setTimeout(() => {
    getData()
  }, 5000)
  if (!result) return

  const { unReadCount, unPushList } = result
  num.value = unReadCount
  ;(unPushList || []).forEach(item => {
    ElNotification({
      message: h('div', {}, [
        h('p', {}, '您有一条' + item.msgTypeDesc + '消息，请到消息中心查看'),
        h('p', { style: { 'text-align': 'right', color: '#399ffd', cursor: 'pointer' }, onClick: onMessage }, '查看详情')
      ]),
      position: 'bottom-right',
      customClass: 'notify-box'
    })
  })

  if (unPushList?.length) {
    emit('new-msg-come')
  }
}

onMounted(() => {
  getData()
})

onBeforeUnmount(() => {
  timer.value && clearTimeout(timer.value);
})
</script>

<style lang="scss" scoped>
.message {
  position: relative;
  padding-right: 27px;
  margin-right: 16px;
  &-icon {
    cursor: pointer;
    height: 28px;
    width: 28px;
    background: url(../../assets/img/msg.png) no-repeat center;
    background-size: 28px 28px;
  }
  &-num {
    position: absolute;
    top: 0;
    left: 18px;
    height: 14px;
    font-size: 11px;
    line-height: 14px;
    padding: 0 3px;
    background-color: #eb656c;
    border-radius: 8px;
    color: #fff;
  }
  &::after {
    position: absolute;
    content: '';
    width: 0;
    height: 22px;
    border-left: 1px solid #bed3ef;
    right: 0;
    top: 3px;
  }
}
</style>
