<template>
  <div class="tablePage-upload" v-if="dialogsNode.visible">
    <el-upload
      ref="uploadNode"
      class="upload-demo"
      drag
      :action="uploadAction"
      :headers="uploadHeaders"
      :on-change="onChangeFile"
      v-bind="this.params.uploadProps"
    >
      <el-icon class="iconUpload"><Plus /></el-icon>
      <div class="el-upload__text">
        {{ this.params.uploadText || '点击或将文件拖拽到这里上传' }}
      </div>
      <div class="el-upload__tip upload-tip" v-if="this.params.tips?.length">
        <p v-for="tip of this.params.tips" :key="tip">{{ tip }}</p>
      </div>
      <template #file v-if="this.params.customFileList">
        {{ this.params.jsx.call(this, this.file, this.fileList) }}
      </template>
    </el-upload>
    <div class="upload-template">
      <el-button v-for="template of this.params.templates" :key="template.key" size="small" v-bind="template" @click="downloadTemplate(template)">
        {{ template.label || '下载模板' }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { genFileId } from 'element-plus'
import { getToken, tokenKey } from '@/utils/auth'
import { BASE_URL } from '@/utils/const'

export default {
  name: 'custom-form',
  props: ['payload', 'onChange', 'dialogData'],
  inject: {
    tablePageNode: {
      default: () => null
    },
    pageNode: {
      default: () => null
    },
    dialogsNode: {
      default: () => null
    }
  },
  computed: {
    uploadAction() {
      return BASE_URL + this.dialogsNode.dialogsConfig.apis[this.dialogData.apiKey]?.url
    },
    uploadHeaders() {
      const token = getToken()
      return {
        [tokenKey]: token
      }
    },
    dialogVisible: {
      get() {
        return this.dialogsNode.dialogVisible
      },
      set(val) {
        this.dialogsNode.dialogVisible = val
      }
    },
    params() {
      const { tips = [], uploadText = '', customFileList = false, jsx = () => {}, templates = [], uploadNumber = 0, uploadResult = [], ...r } = this.dialogData.dialogParams.data
      const t = {}
      Object.keys(r).forEach((item) => {
        if (typeof r[item] === 'function') {
          t[item] = (...k) => r[item].call(this, ...k)
        } else {
          t[item] = r[item]
        }
      })
      return {
        tips,
        uploadText,
        customFileList,
        jsx,
        templates,
        uploadNumber,
        uploadResult,
        uploadProps: t
      }
    },
  },
  data() {
    return {
      file: null,
      fileList: [],
      callback: () => {},
      successNum: 0,
      successResult: []
    }
  },
  methods: {
    downloadTemplate(template) {
      const targetApi = this.dialogsNode.dialogsConfig.apis[template.apiKey]
      targetApi.other = {
        responseType: 'blob'
      }
      this.dialogsNode.sendApi(targetApi, template.params)
    },
    async uploadFiles() {
      this.$refs.uploadNode.submit()
    },
    onChangeFile(uploadFile, uploadFiles) {
      this.file = uploadFiles[0]
      this.fileList = uploadFiles
      this.successNum = uploadFiles.length
    },
    onRemoveFile(uploadFile, uploadFiles) {
      this.file = null
      this.fileList = []
      this.successNum = 0
    },
    onExceed(files) {
      this.$refs.uploadNode.clearFiles()
      const file = files[0]
      file.uid = genFileId()
      this.$refs.uploadNode.handleStart(file)
      this.file = file
    }
  }
}
</script>
<style lang="scss" scoped>
.tablePage-upload {
  .upload-demo {
    text-align: center;
    .iconUpload {
      font-size: 48px;
      color: $blue;
      margin-bottom: 20px;
    }
    .upload-tip {
      text-align: left;
      color: #999;
    }
  }
  .upload-template {
    margin-top: 16px;
    text-align: center;
  }
}
</style>

<style lang="scss">
.tablePage-upload {
  .el-upload-dragger {
    padding: 24px;
    background-color: #f5f7fa;
    border-color: #e2e9f1;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
  .el-upload-list {
    width: 384px;
    text-align: left;
    margin-left: -10px;
    margin-right: auto;
  }
}
</style>
