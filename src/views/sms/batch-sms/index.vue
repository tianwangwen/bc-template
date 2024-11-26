<template>
  <div class="batch-sms">
    <TablePage ref="tablePage" :data="config" />
    <el-dialog
      v-model="dialogVisible"
      :title="smsSendTool === 'mobileSms' ? '批量指掌易短信发送任务配置' : '批量106短信发送任务配置'"
      width="600px"
      @closed="onClosed"
    >
      <div class="dialog">
        <div class="formitem">
          <span class="label">短信任务名称</span>
          <el-input :disabled="isPreview" v-model="smsTaskName" placeholder="请输入" style="width: 220px"></el-input>
        </div>
        <el-steps :active="active" finish-status="success" simple :key="smsSendTool">
          <el-step v-if="smsSendTool === 'mobileSms'" title="主叫号码" />
          <el-step title="人群选择" />
          <el-step title="触发时间及模板" />
        </el-steps>
        <div class="content" v-show="active === 0" v-if="smsSendTool === 'mobileSms'">
          <Form ref="form" :config="config2"></Form>
        </div>
        <div class="content" v-show="active === 1">
          <Form @onFormChange="onFormChange" ref="form2" :config="config3"></Form>
          <p class="tip" v-if="filterNum !== undefined">共 {{ filterNum }} 个号码符合条件 <em v-if="isOverflow">，超过剩余发送条数，无法提交</em> </p>
        </div>
        <div class="content" v-show="active === 2">
          <Form ref="form3" :config="config4"></Form>
          <p class="tip" v-if="smsSendTool === 'mobileSms'">tip：考虑一次性发送存在封卡风险，我们将按照发送开始时间每分钟发送 1 条</p>
          <p class="tip" v-else>tip:短信任务发送占用发送条数</p>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer" v-if="!isPreview">
          <el-button v-if="active === 1 && smsSendTool === 'mobileSms'" @click="active -= 1">上一步</el-button>
          <el-button v-if="active === 2" @click="active -= 1">上一步</el-button>
          <el-button v-if="active === 0" type="primary" @click="onNext">下一步</el-button>
          <el-button v-if="active === 1" :disabled="isComputed" type="primary" @click="onConfirm">确认选择</el-button>
          <el-button v-if="active === 1" :disabled="!isComputed || isOverflow" type="primary" @click="onNext2">下一步</el-button>
          <el-button v-if="active === 2" @click="onResetForm">清空</el-button>
          <el-button v-loading="loading" v-if="active === 2" type="primary" @click="onSubmit">保存配置</el-button>
        </div>
        <div class="dialog-footer" v-else>
          <el-button v-if="active === 1 && smsSendTool === 'mobileSms'" @click="active -= 1">上一步</el-button>
          <el-button v-if="active === 2" @click="active -= 1">上一步</el-button>
          <el-button v-if="active === 0 || active === 1" type="primary" @click="active += 1">下一步</el-button>
          <el-button v-if="active === 2" type="primary" @click="dialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, provide, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { TablePage, Form } from "@lcode/components-vue3";
import SmsApi from '@/api/sms'
import { config, config2, config3, config4 } from './config'

const active = ref(0)
const dialogVisible = ref(false)
const isComputed = ref(false)
const filterNum = ref()
const isOverflow = ref(false)
const isPreview = ref(false)
const previewData = ref({})
const smsTaskName = ref()
const smsSendTool = ref()
const loading = ref(false)

const tablePage = ref()
const form = ref()
const form2 = ref()
const form3 = ref()

const onNext = () => {
  if (!form.value.validate()) return
  if (form.value.getFormItem('num').data.text === 0) {
    ElMessage.error('当前剩余条数0，不允许创建任务')
    return
  }
  active.value = 1
}

const onConfirm = async () => {
  // filterNum.value = 100
  // isComputed.value = true
  if (!form2.value.validate()) return
  const params = form2.value.getFormData()
  const result = await SmsApi.queryProbableNum({
    ...params,
    relationSystem: 0,
    smsSendTool: smsSendTool.value
  })
  if (!result) return
  filterNum.value = result.num
  if (smsSendTool.value === 'mobileSms') {
    const maxNum = form.value.getFormItemValue('num')
    isOverflow.value = result.num > maxNum
  }
  isComputed.value = true
  if (smsSendTool.value === '106Sms') {
    form3.value.optionsFromApis.smsTemplate.apiKey = 'queryTemplateApi3'
    form3.value.getFormItemOptions('smsTemplate', { relationSystem: 0, smsRelation: params.smsRelation, businessRelation: params.businessRelation })
  }
}

const onFormChange = (key, value) => {
  if (isComputed.value) {
    isComputed.value = false
  }
}

const onNext2 = () => {
  active.value = 2
  nextTick(() => {
    form3.value.getFormItem('num').data.text = filterNum.value
  })
}

const onResetForm = () => {
  form3.value.resetFormData()
  if (smsSendTool.value === '106Sms') {
    form3.value.getFormItem('smsTemplateType').show = false
    form3.value.getFormItem('num').show = false
  }
}

const onSubmit = async () => {
  if (loading.value) return
  if (!smsTaskName.value) {
    ElMessage.error('请输入短信名称')
    return
  }
  if (smsTaskName.value.length > 20) {
    ElMessage.error('短信名称最多20个字符')
    return
  }
  if (!form3.value.validate()) return
  loading.value = true
  const form1Data = form.value?.getFormData() || {}
  const form2Data = form2.value?.getFormData() || {}
  const form3Data = form3.value?.getFormData() || {}
  const params = {
    callerId: form1Data.callerId,
    smsTaskName: smsTaskName.value,
    relationSystem: 0,
    smsSendTool: smsSendTool.value,
    createBatchOwnerSendDetailReq: {
      ...form1Data,
      ...form2Data,
      ...form3Data
    }
  }
  const result = await SmsApi.createBatchOwnerSend(params)
  loading.value = false
  if (!result) return
  dialogVisible.value = false
  ElMessage.success('新增成功')
  tablePage.value.onSearch()
}

const onCreateZZY = () => {
  active.value = 0
  smsSendTool.value = 'mobileSms'
  isPreview.value = false
  dialogVisible.value = true
  // nextTick(() => {
  //   form2.value.getFormItem('businessRelation').show = false
  // })
}

const onCreate106 = () => {
  active.value = 1
  smsSendTool.value = '106Sms'
  isPreview.value = false
  dialogVisible.value = true
  setTimeout(() => {
    form3.value.getFormItem('smsTemplateType').show = false
    form3.value.getFormItem('num').show = false
    form3.value.getFormItem('smsTemplateBody').data.disabled = true
  }, 100);
}

const onPreview = (data) => {
  smsTaskName.value = data.smsTaskName
  smsSendTool.value = data.smsSendTool
  active.value = data.smsSendTool === "mobileSms" ? 0 : 1
  previewData.value = data
  isPreview.value = true
  dialogVisible.value = true
  nextTick(() => {
    form.value?.setFormData(data.bodyOwnerSendDetailDto)
    form2.value?.setFormData(data.bodyOwnerSendDetailDto)
    form3.value?.setFormData(data.bodyOwnerSendDetailDto)
    form.value?.formData.forEach((item) => {item.data.disabled = true})
    form2.value?.formData.forEach((item) => {item.data.disabled = true})
    form3.value?.formData.forEach((item) => {item.data.disabled = true})
    nextTick(() => {
      if (data.smsSendTool === "mobileSms") {
        // form2.value.getFormItem('businessRelation').show = false
        
      } else {
        form3.value.getFormItem('smsTemplateType').show = false
        form3.value.getFormItem('num').show = false

        // 回显接口不返回已选择模板，只能强制设置展示内容
        // form3.value.getFormItem('smsTemplate').data.value = data.bodyOwnerSendDetailDto.smsTemplateName
        // setTimeout(() => {
        //   form3.value.getFormItem('smsTemplateBody').data.value = data.bodyOwnerSendDetailDto.smsTemplateBody
        // })
        // form3.value.optionsFromApis.smsTemplate.apiKey = 'queryTemplateApi3'
        // form3.value.getFormItemOptions('smsTemplate', { relationSystem: 0, smsRelation: data.bodyOwnerSendDetailDto.smsRelation })
      }
      form3.value.getFormItem('smsTemplate').data.value = data.bodyOwnerSendDetailDto.smsTemplateName
      setTimeout(() => {
        form3.value.getFormItem('smsTemplateBody').data.value = data.bodyOwnerSendDetailDto.smsTemplateBody
      })
    })
  })
}

const onClosed = () => {
  active.value = 0
  isComputed.value = false
  smsTaskName.value = undefined
  form.value?.resetFormData()
  form2.value?.resetFormData()
  form3.value?.resetFormData()
  form.value?.formData.forEach((item) => {item.data.disabled = false})
  form2.value?.formData.forEach((item) => {item.data.disabled = false})
  form3.value?.formData.forEach((item) => {item.data.disabled = false})
}

provide('pageNode', {
  dialogVisible,
  smsSendTool,
  tablePage,
  onCreateZZY,
  onCreate106,
  onPreview,
})

defineOptions({
  name: 'SmsBatchSms'
})
</script>

<style lang="scss" scoped>
.batch-sms {
  .dialog {
    .content {
      margin-top: 24px;
      min-height: 440px;
    }
    .tip {
      color: #F56C6C;
      font-weight: bold;
      em {
        font-style: normal;
      }
    }
    .formitem {
      margin-bottom: 24px;
      .label {
        position: relative;
        margin-right: 12px;
        font-size: 12px;
        font-weight: bold;
        color: #0d243e;
        &::after {
          content: "*";
          color: #f56c6c;
          font-size: 12px;
          margin-left: 4px;
        }
      }
    }
  }
  ::v-deep {
    .el-step__line {
      display: none;
    }
  }
}
</style>
