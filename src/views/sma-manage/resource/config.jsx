import { ElMessageBox } from 'element-plus'
import ResourceApi from '@/api/resource'

export default {
  "apis": {
    "searchApi": {
      "method": "post",
      "url": "/admin/document/page"
    },
    "deleteApi": {
      "url": "/admin/document/delete"
    },
    "uploadApi": {
      "url": "/admin/oss/uploadFile"
    }
  },
  "tableConfig": {
    "columns": [
      {
        "prop": "userNo",
        "label": "工号"
      },
      {
        "prop": "realName",
        "label": "姓名",
        "show-overflow-tooltip": true,
      },
      {
        "prop": "gender",
        "label": "性别"
      },
      {
        "prop": "departmentName",
        "label": "部门",
        "show-overflow-tooltip": true,
        "colType": "jsx",
        "jsx"(self, data) {
          return(
            <el-text>{data.row.departmentName ? data.row.departmentName : '--'}</el-text>
          )
        }
      },
      {
        "prop": "groupName",
        "label": "小组",
        "colType": "jsx",
        "jsx"(self, data) {
          return(
            <el-text>{data.row.groupName ? data.row.groupName : '--'}</el-text>
          )
        }
      },
      {
        "prop": "documentType",
        "label": "资料类型",
        "colType": "variableMap",
        "variableKey": "documentType"
      },
      {
        "prop": "documentPath",
        "label": "资料",
        "colType": "jsx",
        width: 150,
        "jsx"(self, data) {
          const { documentPath = [] } = data.row
          return (
            <>
              {
                documentPath.map((item) => (
                  <el-button style="margin-left: 0" type="primary" link onClick={() => self.pageNode.onPreview(item)}>
                    <el-text title={item} style={{ width: '140px', color: ''}} type='primary' truncated>{item}</el-text>
                  </el-button>
                ))
              }
            </>
          )
        }
      },
      {
        "prop": "updateTime",
        "label": "资料更新时间"
      },
      {
        "prop": "actions",
        "label": "操作",
        "colType": "actions",
        "buttons": [
          "uploadButton",
          "downloadButton",
          "deleteButton",
        ]
      }
    ],
    "pagination": {},
    "config": {
      "other": {
        "height": "calc(100vh - 66px - 37px - 40px - 48px - 44px - 12px"
      }
    }
  },
  "forms": {
    "searchForm": {
      "formItemWidth": 120,
      "labelType": "Search",
      "key": "searchForm",
      "data": [
        {
          "key": "userNo",
          "data": {
            "placeholder": "坐席工号",
            "clearable": true,
          },
        },
        {
          "key": "realName",
          "data": {
            "placeholder": "坐席姓名",
            "clearable": true,
          }
        },
        {
          "useFormItemConfig": "groupId",
          "data": {
            "placeholder": "小组"
          }
        },
        {
          "useFormItemConfig": "department",
          "key": "department",
          "data": {
            "placeholder": "部门"
          }
        },
        {
          "key": "documentType",
          "type": "Select",
          "data": {
            "placeholder": "资料类型"
          },
          "getOptionsFromVariables": {
            "variableKey": "documentType"
          }
        },
      ]
    }
  },
  "buttonGroup": [
    "searchButton",
    "resetButton"
  ],
  "dialogs": {
    "deleteDialog": {
      "useDialogConfig": "deleteDialog",
      "content": "您是否确认删除该资料？",
      "width": "380px"
    },
    "uploadDialog": {
      "key": "uploadDialog",
      "title": "更新资料",
      "type": "upload",
      "actionType": "custom",
      async "onClick"() {
        if (this.dialogs.$refs.component.fileList.find((item) => item.size > 1024 * 1024 * 10)) {
          this.$message.warning('存在超过10M的文件')
          return
        }
        if (!this.dialogs.$refs.component.fileList.length) return
        const numbers = this.dialogs.$refs.component.fileList.filter((item) => !item.isUpload).length
        if (numbers === 0) {
          if (this.payload.documentPath?.length === this.dialogs.$refs.component.fileList.length) {
            return true
          } else {
            const result2 = await ResourceApi.update({
              id: this.payload.id,
              urls: this.dialogs.$refs.component.fileList.map((item) => item.name)
            })
            if (!result2) return
            return true
          }
        } else {
          this.tablePageData.dialogs.uploadDialog.data.uploadNumber = numbers
        }
        this.dialogs.$refs.component?.uploadFiles()
      },
      "apiKey": "uploadApi",
      "onCallback": [
        "onSearch",
        "showSuccessMessage"
      ],
      "on": {
        "open"() {
          const uploadfile = (this.payload.documentPath || []).map((item) => ({ name: item, isUpload: true }))
          this.$refs.component.fileList = uploadfile
          this.tablePageNode.tablePageData.dialogs.uploadDialog.data['file-list'] = uploadfile
          this.$refs.component.params.uploadResult = []
        }
      },
      "data": {
        "tips": ["文件大小限制10MB"],
        "templates": [],
        "multiple": true,
        "auto-upload": false,
        "file-list": [],
        "uploadNumber": 0,
        "uploadResult": [],
        async "http-request"(uploadRequestOptions) {
          const result = await ResourceApi.uploadFile({ multipartFile: uploadRequestOptions.file })
          if (!result) return false
          this.params.uploadResult.push(result)
          if (this.params.uploadResult.length === this.params.uploadNumber) {
            const uploadedFileName = this.fileList.filter((item) => item.isUpload).map((item) => item.name)
            const result2 = await ResourceApi.update({
              id: this.tablePageNode.payload.id,
              urls: [...uploadedFileName, ...this.params.uploadResult]
            })
            if (!result2) return
            this.$message.success('更新资料成功')
            this.tablePageNode.onSearch()
            this.params.uploadResult = []
            this.params.uploadNumber = 0
            this.tablePageNode.dialogVisible = false
          }
        },
        "before-remove"(file) {
          return new Promise((r, j) => {
            ElMessageBox.confirm(
              '您确认删除资料吗?',
              '删除文件',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
              }
            )
              .then((value) => {
                if (value) {
                  this.fileList.splice(this.fileList.findIndex((item) => item.name === file.name), 1)
                  r()
                } else {
                  j()
                }
              })
              .catch(() => {})
          })
        }
      }
    }
  },
  "buttons": {
    "uploadButton": {
      "label": "更新",
      "type": "primary",
      "link": true,
      "actionType": "dialog",
      "dialogKey": "uploadDialog"
    },
    "downloadButton": {
      "label": "下载",
      "type": "primary",
      "link": true,
      "actionType": "custom",
      "onClick"(data) {
        data.documentPath?.forEach((item) => {
          this.pageNode.onDownload(item)
        })
      }
    }
  },
  "variables": {
    "documentType": {
      "type": "custom",
      "value": [
        {
          "label": "身份证正面",
          "value": 101
        },
        {
          "label": "身份证反面",
          "value": 102
        },
        {
          "label": "学历证明",
          "value": 103
        },
        {
          "label": "简历",
          "value": 104
        },
        {
          "label": "无犯罪证明",
          "value": 105
        },
        {
          "label": "征信报告",
          "value": 106
        },
        {
          "label": "调解员证书",
          "value": 107
        },
        {
          "label": "体检表",
          "value": 108
        },
        {
          "label": "银行卡正面",
          "value": 109
        },
        {
          "label": "银行卡反面",
          "value": 110
        },
        {
          "label": "合同",
          "value": 111
        }
      ]
    }
  }
}
