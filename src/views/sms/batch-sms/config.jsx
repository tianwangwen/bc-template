import clone from 'clone'
import SmsApi from '@/api/sms'

const relation = [
  {
    "label": "本人",
    "value": "1"
  },
  {
    "label": "二三联(亲属)",
    "value": "2"
  },
  {
    "label": "二三联(非亲属)",
    "value": "3"
  }
]

const variables = {
  "sendStatusVariable": {
    "key": "sendStatusVariable",
    "type": "custom",
    "value": [
      {
        "label": "待审批",
        "value": 0
      },
      {
        "label": "待发送",
        "value": 10
      },
      {
        "label": "发送中",
        "value": 20
      },
      {
        "label": "已完成",
        "value": 30
      },
      {
        "label": "已取消",
        "value": 40
      },
      {
        "label": "执行失败",
        "value": 50
      },
      {
        "label": "审批拒绝",
        "value": 60
      }
    ]
  },
  "relationVariable": {
    "key": "relationVariable",
    "type": "custom",
    "value": relation
  },
  "smsSendToolVariable": {
    "key": "smsSendToolVariable",
    "type": "custom",
    "value": [
      { "label": "指掌易", "value": "mobileSms" },
      { "label": "106短信", "value": "106Sms" },
    ]
  }
}

const resultTableConfig = {
  "apis": {
    "searchApi": {
      "method": "post",
      "url": "/admin/batchOwnerSendQuerySendDetail",
      "handleParams"(params) {
        return {
          taskId: params.id
        }
      },
      "handleResult"(result) {
        return {
          result: [result.result],
          total: 1
        }
      }
    },
  },
  "tableConfig": {
    "columns": [
      {
        "prop": "smsTaskName",
        "label": "短信任务名称",
        "show-overflow-tooltip": true,
      },
      {
        "prop": "smsSendTool",
        "label": "发送工具",
        "colType": "variableMap",
        "variableKey": "smsSendToolVariable"
      },
      {
        "prop": "smsRelation",
        "label": "发送对象",
        "colType": "render",
        "render": (value, data) => data?.smsRelation?.map((item) => (relation.find((i) => i.value === '' + item) || {}).label).join(',')
      },
      {
        "prop": "smsTemplateName",
        "label": "短信模板",
        "show-overflow-tooltip": true,
      },
      {
        "label": "计划发送量",
        "prop": "planSendNum",
      },
      {
        "label": "过滤量",
        "prop": "filterSendNum",
      },
      {
        "label": "实际推送量",
        "prop": "sendTotalNum",
      },
      {
        "prop": "sendSuccessNum",
        "label": "发送成功量(约)"
      },
      {
        "prop": "receiveRate",
        "label": "短信回执率",
        "useTableColumnConfig": "percent2",
      },
      {
        "prop": "successRate",
        "label": "成功率",
        "useTableColumnConfig": "percent2",
      },
      {
        "prop": "actions",
        "label": "发送失败补偿",
        "colType": "actions",
        "buttons": ["resendButton"]
      },
    ],
    "pagination": {
      "notPagination": true
    },
    "config": {}
  },
  "buttons": {
    "resendButton": {
      "label": "指掌易补偿",
      "type": "primary",
      "link": true,
      "actionType": "custom",
      "size": "small",
      "onClick"(data) {
        // this.pageNode.tablePage.value.payload = data
        this.pageNode.tablePage.value.dialogKey = 'resendDialog'
        this.pageNode.tablePage.value.dialogVisible = true
      },
      "disabled"(data) {
        const { sendStatus } = this.pageNode.tablePage.value.payload
        return !(sendStatus === 30 || sendStatus === 50) || data.sendTotalNum === 0 || data.successRate === 100 || data.hasCompensation
      }
    }
  },
  variables
}



export const config2 = {
  "apis": {
    "queryPhoneApi": {
      "url": "/admin/batchOwnerSendGetDunUserBindPhones"
    },
    "queryMobilePhoneRemainNumApi": {
      "url": "/admin/batchOwnerSendQueryMobilePhoneRemainNum"
    }
  },
  "data": {
    "formItemWidth": 220,
    "data": [
      {
        "key": "callerId",
        "label": "主叫号",
        "type": "Select",
        "required": true,
        "data": {
          "multiple": true
        },
        "handleGetValue"(value, target, item, data) {
          if (!value || !value.length) return
          target[item.key] = value.join(',')
        },
        "handleSetValue"(value, item, data, formData) {
          if (!value) return item.data.value = []
          item.data.value = value.split(',')
        },
        "getOptionsFromApis": {
          "apiKey": "queryPhoneApi",
          "handleOptionsKey": "default",
          "handleOptionsParams": {
            "labelKey": "phone",
            "valueKey": "phone",
          },
        },
        "publish": {
          "key": "num",
          "match": value => !!value,
          "success": ["show", function(value) {
            if (!value || !value.length) return
            this.getFormItemOptions('num', { mobiles: value })
          }],
          "error": "hide"
        }
      },
      {
        "key": "num",
        "label": "当前剩余条数",
        "type": "Text",
        "data": {
          "text": '-',
          "style": {
            "color": "#F56C6C"
          }
        },
        "getOptionsFromApis": {
          "apiKey": "queryMobilePhoneRemainNumApi",
          "isMounted": false,
          "handleOptions"(result) {
            this.getFormItem('num').data.text = result.totalRemainNum
            return []
          }
        }
      },
    ]
  }
}

export const config3 = {
  "data": {
    "formItemWidth": 220,
    "data": [
      {
        "key": "businessRelation",
        "label": "业务线",
        "type": "Select",
        "required": true,
        "data": {
          "options": [
            // { "label": "全部", "value": "all" },
            { "label": "KOO", "value": "koo" },
            { "label": "拍拍贷", "value": "ppd" },
            { "label": "小辉付", "value": "yunjin" },
          ]
        },
      },
      {
        "useFormItemConfig": "rangeInput",
        "key": "maxDefaultDay",
        "submitKeys": ["maxDefaultDayStart", "maxDefaultDayEnd"],
        "label": "最大逾期天数",
        "data": {
          "style": { "width": "120px" },
          "start-placeholder": "全部",
          "end-placeholder": "全部",
        },
      },
      {
        "useFormItemConfig": "rangeInput",
        "key": "recentLoginDay",
        "submitKeys": ["recentLoginDayStart", "recentLoginDayEnd"],
        "label": "最近登录天数",
        "data": {
          "style": { "width": "120px" },
          "start-placeholder": "全部",
          "end-placeholder": "全部",
        }
      },
      {
        "useFormItemConfig": "rangeInput",
        "key": "lastDunTime",
        "label": "上次催收天数",
        "submitKeys": ["lastDunTimeStart", "lastDunTimeEnd"],
        "data": {
          "style": { "width": "120px" },
          "start-placeholder": "全部",
          "end-placeholder": "全部",
        }
      },
      {
        "useFormItemConfig": "rangeInput",
        "key": "inDunTime",
        "submitKeys": ["inDunTimeStart", "inDunTimeEnd"],
        "label": "入库天数",
        "data": {
          "style": { "width": "120px" },
          "start-placeholder": "全部",
          "end-placeholder": "全部",
        }
      },
      {
        "useFormItemConfig": "rangeInput",
        "key": "owingAmount",
        "submitKeys": ["owingAmountStart", "owingAmountEnd"],
        "label": "逾期总额",
        "data": {
          "style": { "width": "120px" },
          "start-placeholder": "全部",
          "end-placeholder": "全部",
        }
      },
      {
        "key": "hasPromiseRepay",
        "label": "是否下P",
        "type": "Select",
        "required": true,
        "data": {
          "options": [
            { "label": "全部", "value": -1 },
            {
              "label": "是",
              "value": 1
            },
            {
              "label": "否",
              "value": 0
            },
          ]
        },
      },
      {
        "key": "smsRelation",
        "label": "发送对象",
        "type": "Checkbox",
        "required": true,
        "data": {
          "style": { "width": "340px" },
          "options": clone(relation)
        },
        "subscribe": {
          "key": "smsRelation",
          "onCallback"(value, subscriber) {
            if (!value || !value.length) return subscriber.data.options = clone(relation)
            subscriber.data.options = clone(relation).map((item) => value.includes("1") ? (item.value === "1" ? item : { ...item, disabled: true }) : (item.value === "1" ? { ...item, disabled: true } : item))
          }
        },
        "handleGetValue"(value, target, item, data) {
          if (!value || !value.length) return
          target[item.key] = value.join(',')
        },
        "handleSetValue"(value, item, data, formData) {
          if (!value || !value.length) return item.data.value = []
          item.data.value = value.split(',')
        },
        "rules": [
          {
            "rule": "_emptyArray",
            "message": "请选择"
          }
        ]
      },
    ]
  }
}

const handleTime = (t = '') => {
  const d = t.split(':')
  if (d[1] > '30') {
    d[0] = Number(d[0]) + 1
    d[1] = "00"
    if (d[0] < 10) {
      d[0] = '0' + d[0]
    }
  }
  return `${d[0]}:${d[1]}`
}

export const config4 = {
  "apis": {
    "queryTemplateApi": {
      "url": "/admin/batchOwnerSendQueryMobileBatchSendTemplate"
    },
    "queryTemplateApi2": {
      "url": "/admin/mobileSmsTemplateSearchTemplateForBatch",
      "handleParams"(params) {
        return {
          ...params,
          sendType: 'batchSend'
        }
      }
    },
    "queryTemplateApi3": {
      "url": "/admin/batchOwnerSendGetDunSMSBatchSendTemplate"
    },
    "getCanUseApi": {
      "url": "/admin/batchOwnerSendGetCanUse",
    }
  },
  "data": {
    "formItemWidth": 220,
    "data": [
      {
        "key": "cycleTime",
        "label": "发送开始时间",
        "type": "TimeSelect",
        "required": true,
        "data": {
          "step": "00:30",
          "start": undefined,
          "end": undefined
        },
        "getOptionsFromApis": {
          "apiKey": "getCanUseApi",
          "handleOptions"(data = {}) {
            this.getFormItem('cycleTime').data.start = handleTime(data.startTime)
            this.getFormItem('cycleTime').data.end = handleTime(data.endTime)
            return []
          }
        },
      },
      {
        "key": "smsTemplateType",
        "label": "模板类型",
        "type": "Radio",
        "required": true,
        "data": {
          "options": [
            { "label": "系统模板", "value": 0 },
            // { "label": "自定义话术库", "value": 1 },
          ]
        },
        "publish": {
          "key": "smsTemplate",
          "match": value => value !== undefined,
          "success": ["clear", function(value) {
            const smsTemplate = this.getFormItem('smsTemplate')
            smsTemplate.data.options = []
            this.optionsFromApis.smsTemplate.apiKey = value === 0 ? 'queryTemplateApi' : 'queryTemplateApi2'
            const params = value === 0 ? { relationSystem: 0 } : {}
            this.getFormItemOptions('smsTemplate', params)
          }],
        }
      },
      {
        "key": "smsTemplate",
        "label": "短信模板",
        "type": "Select",
        "required": true,
        "data": {
          "filterable": true
        },
        "getOptionsFromApis": {
          "apiKey": "queryTemplateApi",
          "isMounted": false,
          "handleOptions"(data = []) {
            const smsTemplateTypeValue = this.getFormItemValue('smsTemplateType')
            if (smsTemplateTypeValue === 0) {
              return data.map((item) => ({
                "label": item.displayName,
                "value": item.templateName,
                "body": item.templateBody
              }))
            } else if (smsTemplateTypeValue === 1) {
              return data.map((item) => ({
                "label": item.title,
                "value": item.title,
                "body": item.content
              }))
            } else {
              return data.map((item) => ({
                "label": item.displayName,
                "value": item.templateName,
                "body": item.templateBody
              }))
            }
          }
        },
        "publish": {
          "key": "smsTemplateBody",
          "match": value => !!value,
          "success": ["clear", function(value, subscriber) {
            if (!value) return
            const smsTemplate = this.getFormItem('smsTemplate')
            const b = (smsTemplate.data.options.find((item) => item.value === value) || {}).body
            subscriber.data.value = b
          }],
          "error": "clear"
        }
      },
      {
        "key": "smsTemplateBody",
        "label": "短信内容",
        "required": true,
        "data": {
          // "disabled": true,
          "type": "textarea",
          "autosize": { "minRows": 4 }
        }
      },
      {
        "key": "num",
        "label": "预计发送量",
        "type": "Text",
        "data": {
          "text": '-',
          "style": {
            "color": "#F56C6C"
          }
        }
      },
    ]
  }
}

export const config = {
  "apis": {
    "searchApi": {
      "method": "post",
      "url": "/admin/batchOwnerSendPageQueryBatchOwnerSendDto"
    },
    "deleteApi": {
      "url": "/admin/batchOwnerSendDeleteBatchOwnerSend"
    },
    "compensationBatchSendMobileSmsApi": {
      "url": "/admin/batchOwnerSendCompensationBatchSendMobileSms",
      "handleParams"(params) {
        return {
          ...params,
          id: this.pageNode.tablePage.value.payload.id
        }
      }
    },
    "compensationBatchSendMobileSmsNumAndBodyApi": {
      "url": "/admin/compensationBatchSendMobileSmsNumAndBody",
      "handleResult"(result) {
        this.getFormItem('num2').data.text = result?.result?.numDto?.num
        return {
          "data": { "smsTemplateBody": result?.result?.bodyDto?.smsTemplateBody }
        }
      }
    },
    ...config2.apis
  },
  "tableConfig": {
    "columns": [
      {
        "label": "序号",
        "prop": "id"
      },
      {
        "prop": "smsTaskName",
        "label": "短信任务名称",
        "show-overflow-tooltip": true,
      },
      {
        "prop": "smsSendTool",
        "label": "发送工具",
        "colType": "variableMap",
        "variableKey": "smsSendToolVariable"
      },
      {
        "prop": "smsRelation",
        "label": "发送对象",
        "colType": "render",
        "render": (value, data) => data.bodyOwnerSendDetailDto?.smsRelation?.split(',')?.map((item) => (relation.find((i) => i.value === item) || {}).label).join(',')
      },
      {
        "prop": "smsTemplateName",
        "label": "短信模板",
        "colType": "render",
        "render": (value, data) => data.bodyOwnerSendDetailDto?.smsTemplateName,
        "show-overflow-tooltip": true,
      },
      {
        "label": "发送时间",
        "prop": "cycleTime",
        "min-width": "130px",
        "colType": "render",
        "render": (value, data) => data.bodyOwnerSendDetailDto?.cycleTime
      },
      {
        "prop": "sendStatus",
        "label": "发送状态",
        "colType": "jsx",
        "jsx"(self, { row }) {
          const variable = self.tablePageNode.variablesResult.sendStatusVariable?.value || []
          const text = (variable.find((item) => item.value === row.sendStatus) || {}).label
          const onClick = () => {
            self.tablePageNode.dialogKey = 'resultDailog'
            self.tablePageNode.dialogVisible = true
            self.tablePageNode.payload = row
          }
          const onClick2 = () => {
            SmsApi.getFlowJumpLink({ processInstanceId: row.bpmNo }).then(
              (result) => {
                window.open(result, '_blank')
              },
              res => {
                ElMessage.error(res)
              }
            )
          }
          if (row.sendStatus !== 0 && row.sendStatus !== 10 && row.sendStatus !== 60) {
            return (
              <el-button size="small" type="primary" link onClick={onClick}>{text}</el-button>
            )
          } else if (row.sendStatus === 0) {
            return (
              <el-button size="small" type="primary" link onClick={onClick2}>{text}</el-button>
            )
          } else {
            return (
              <span>{text}</span>
            )
          }
        }
      },
      {
        "prop": "inserttime",
        "label": "创建时间",
        "min-width": "130px"
      },
      {
        "prop": "createOperatorRealName",
        "label": "更新人"
      },
      {
        "prop": "actions",
        "label": "操作",
        "colType": "actions",
        "buttons": ["detailButton", "deleteButton"]
      }
    ],
    "pagination": {},
    "config": {}
  },
  "forms": {
    "searchForm": {
      "formItemWidth": 120,
      "labelType": "Search",
      "key": "searchForm",
      "data": [
        {
          "key": "smsTaskName",
          "data": {
            "placeholder": "短信任务名称"
          }
        },
        {
          "data": {
            "placeholder": "发送对象"
          },
          "type": "Select",
          "key": "smsRelation",
          "getOptionsFromVariables": {
            "variableKey": "relationVariable"
          }
        },
        {
          "key": "smsSendTool",
          "type": "Select",
          "data": {
            "placeholder": "发送工具",
          },
          "getOptionsFromVariables": {
            "variableKey": "smsSendToolVariable"
          }
        },
      ]
    },
    "resendForm": {
      "data": [
        ...config2.data.data,
        {
          "key": "smsTemplateBody",
          "label": "短信内容",
          "required": true,
          "ignore": true,
          "data": {
            "disabled": true,
            "type": "textarea",
            "autosize": { "minRows": 4 }
          }
        },
        {
          "key": "num2",
          "label": "预计发送量",
          "type": "Text",
          "ignore": true,
          "data": {
            "text": '-',
            "style": {
              "color": "#F56C6C"
            }
          }
        },
      ]
    }
  },
  "buttonGroup": [
    "searchButton",
    "create106Button"
  ],
  "buttons": {
    "createButton": {
      "useButtonConfig": "createButton",
      "label": "新增指掌易任务",
      "actionType": "custom",
      "onClick"() {
        this.pageNode.onCreateZZY()
      }
    },
    "create106Button": {
      "useButtonConfig": "createButton",
      "label": "新增106任务",
      "actionType": "custom",
      "onClick"() {
        this.pageNode.onCreate106()
      },
    },
    "detailButton": {
      "key": "detailButton",
      "label": "查看",
      "type": "primary",
      "link": true,
      "actionType": "custom",
      "onClick"(data) {
        this.pageNode.onPreview(data)
      }
    }
  },
  "dialogs": {
    "deleteDialog": {
      "useDialogConfig": "deleteDialog",
      "content": "确定删除吗？删除后不可恢复"
    },
    "resultDailog": {
      "key": "resultDailog",
      "title": "发送结果",
      "type": "table",
      "width": "1300px",
      "prop": resultTableConfig,
      "showSubmit": false,
      "cancelText": "关闭",
      "on": {
        "open"(data) {
          const targetCol = clone(resultTableConfig.tableConfig.columns)
          if (this.payload.smsSendTool === 'mobileSms') {
            targetCol.pop()
          }
          this.$refs.component.$refs.tablePage.onChangeColumns(targetCol)
        }
      }
    },
    "resendDialog": {
      "key": "resendDialog",
      "title": "指掌易短信发送补偿",
      "type": "form",
      "formKey": "resendForm",
      "isApplyPayloadForForm": true,
      "getFormDataFromApiKey": "compensationBatchSendMobileSmsNumAndBodyApi",
      "actionType": "api",
      "beforeSubmit"() {
        const num = this.$refs.dialogForm.getFormItem('num')
        if (num.data.text === 0) {
          this.$message.error('当前剩余条数0，不允许创建任务')
        }
        return num.data.text !== 0
      },
      "apiKey": "compensationBatchSendMobileSmsApi",
      "width": "600px",
      "onCallback": ["showSuccessMessage", "onSearch"]
    }
  },
  variables
}


