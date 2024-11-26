<template>
  <div>
    <el-upload
      ref="uploadNode"
      class="avatar-uploader"
      :name="itemkey"
      :list-type="data.listType"
      :show-file-list="false"
      :data="payload"
      :http-request="httpRequest"
      :before-upload="beforeUpload"
      accept="image/*"
      v-bind="data"
      v-on="on"
      :disabled="!!(data.type === 'pictrue' && data.value.length)"
      :style="{ 'max-width': formItemWidth, ...data.style }"
    >
    <template #trigger>
      <el-button  v-if="!data.isPreview && !(data.type === 'pictrue' && data.value.length)">
        <el-icon class="el-icon--right"><Upload /></el-icon> 上传文件
      </el-button>
    </template>
    <div v-if="data.type === 'pictrue' && data.value.length < 2" class="el-upload-list el-upload-list--picture-card">
      <template v-for="(_, index) in data.value" :key="index">
        <img class="el-upload-list__item-thumbnail" :src="avatarUrl" />
        <span class="el-upload-list__item-actions" v-if="!data.isPreview">
          <span
            class="el-upload-list__item-delete"
            @mousedown="handleRemove(index)"
          >
            <el-icon :size="14"><Delete /></el-icon>
          </span>
        </span>
      </template>
    </div>
    <ul v-else class="el-upload-list el-upload-list--text">
      <li class="is-ready" tabindex="0" v-for="(documentUrl, index) in data.value" :key="index">
        <div class="el-upload-list__item-info">
            <span class="el-upload-list__item-file-name" :title="getFileFullName(documentUrl)">
              <el-link type="primary" @click="previewFile(documentUrl)">{{ getFileFullName(documentUrl) }}</el-link>
            
            </span>
          <el-icon @click="downLoadFile(documentUrl)" color="#3487F4" style="margin: 0 2px 0 8px;"><Download /></el-icon>
          <el-icon v-if="!data.isPreview" @click="handleRemove(index)" color="#3487F4"><Close /></el-icon>
        </div>
      </li>
    </ul>
    <el-dialog v-model="dialogVisible" title="查看" destroy-on-close>
      <div class="carousel-item">
        <el-image v-if="/\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)/i.test(fileName)" style="width: 100%;height: 100%;"
        :src="dialogImageUrl" :preview-src-list="[dialogImageUrl]" fit="contain" :preview-teleported="true" />
        <div v-else style="text-align: center;">
          <p style="margin-bottom: 8px; color: #999;">该文件不支持查看</p>
          <el-button type="primary" @click="downLoadFile(dialogImageUrl)">下载文件</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog> -->
    </el-upload>
  </div>
</template>

<script>
import { isImage } from '@/utils/tools'
import uploadFileApi from '@/api/upload'
import axios from "@/network";
import { ElMessage } from 'element-plus'

export default {
  name: "form-item-upload",
  // components: {
  //   Upload
  // },
  inject: {
    emitPublish: {
      default: () => {},
    },
    formNode: {
      default: () => ({}),
    },
    tablePageNode: {
      default: () => ({}),
    },
    dialogsNode: {
      default: () => ({}),
    },
    pageNode: {
      default: () => null,
    },
  },
  emit: ["validate"],
  props: ["size", "itemkey", "data", "on", "itemProps", "formItemWidth", "type"],
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      fileName: '',
      avatarUrl: '',
      payload: {},
    };
  },
  methods: {
    beforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        ElMessage.warning('上传文件大小不能超过 10MB!');
        return  false
     }
     if(this.data.value && this.data.value.length > 9) {
        ElMessage.warning('上传文件总数不能超过10个!');
        return  false
     }
     return true
    },
    handleRemove(index = 0) {
      this.data.value.splice(index, 1)
      this.avatarUrl = ''
    },
    // 手动上传
    async httpRequest(options) {
      const file = options.file
      const documentUrl = await uploadFileApi.uploadFile({multipartFile: file})
      if(!documentUrl) return
      if(!this.data.value) {
        this.data.value = []
      }
      if(this.data.value.length > 9) {
        return  false
      }
      this.data.value.push(documentUrl)
    },
    // 点击预览图片
    async previewFile(filePath) {
      const type = this.getFileType(filePath, 1)
      this.fileName = this.getFileFullName(filePath)
      this.dialogVisible = true
      if(isImage(`.${type}`)) {
        this.dialogImageUrl = await this.getImgUrl(filePath)
      }else {
        this.dialogImageUrl = filePath
      }
    }, 
    async getImgUrl(filePath) {
      const type = this.getFileType(filePath, 1)
      if(isImage(`.${type}`)) {
        const { result } = await this.getimageData(filePath)
        if(result) {
          const url = URL.createObjectURL(result)
          return url
        }
      }
    },
    // 下载文件
    downLoadFile(uid) {
      return axios({
        url: "/admin/oss/download",
        method: "post",
        responseType: "blob",
        params: {
          filePath: uid,
        },
      })
    },
    // 获取请求文件流
    getimageData (uid)  {
      return axios({
        url: "/admin/oss/download",
        method: "post",
        responseType: "blob",
        unDownLoad: true,
        params: {
          filePath: uid,
        },
      })
    },
    // 获取文件类型
    getFileType(documentUrl, type) {
      if(!documentUrl) return
      const fileList = documentUrl?.split('$')
      return fileList[type]
    },
    // 获取文件全明
    getFileFullName(documentUrl) {
      if(!documentUrl) return
      return documentUrl?.split('$').splice(0, 2).join('.')
    },
  },
  watch: {
    'data.value': {
      async handler(newVal) {
        if(this.data.type === 'pictrue' && newVal.length > 0) {
          this.avatarUrl = await this.getImgUrl(newVal[0])
        }
      },
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped>
:deep(.el-upload--picture-card) {
  --el-upload-picture-card-size: auto;
  border: none;
  background-color: #fff
}
.el-upload-list__item-thumbnail {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 3px;
}
:deep(.el-upload-list--picture-card) {
  --el-upload-list-picture-card-size: 48px;
}

.el-upload-list__item-info {
  display: flex;
  align-items: flex-end;
}

.el-upload-list--picture-card .el-upload-list__item-actions span + span  {
  margin-left: 4px;
}

:deep(.el-link) {
  .el-link__inner {
    width: 120px;
    display: block;
    overflow: hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
  }
}

.carousel-item {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
