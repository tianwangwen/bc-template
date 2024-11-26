import { sensorsList } from '@/utils/sensors'

const columns = [
  {
    "prop": "kindName",
    "label": "类别"
  },
  {
    "prop": "typeName",
    "label": "消息种类"
  },
  {
    "label": "时间",
    "prop": "updateTime"
  },
  {
    "label": "内容",
    "prop": "content",
  }
]

const msgTypeOption = [
  {
    "label": "系统执行消息",
    "value": 0
  },
  {
    "label": "Q消息",
    "value": 1
  }
]

const typeOptions = [
  {
    "label": "批量修改owner",
    "value": 2
  },
  {
    "label": "自助分案",
    "value": 18
  },
  {
    "label": "案件指派",
    "value": 19
  },
  {
    "label": "Owner交换分配",
    "value": 20
  },
  {
    "label": "清空经办名下案件",
    "value": 21
  }
]

const typeOptions2 = [
  {
    "label": "Q消息",
    "value": 17
  },
]

const historyConfig = {
  "apis": {
    "searchApi": {
      "method": "post",
      "url": "/admin/getReadSysMsgList",
      "handleParams"(params, data) {
        return {
          ...params,
          ...data,
          ...this.$refs.tablePage.getSearchData(),
        }
      }
    }
  },
  "tableConfig": {
    "columns": columns,
    "pagination": {
      "notPagination": false,
      "size": "small"
    },
    "config": {}
  },
  "forms": {
    "searchForm": {
      "key": "searchForm",
      "data": [
        {
          "key": "msgType",
          "data": {
            "placeholder": "类别",
            "options": msgTypeOption
          },
          "type": "Select",
        },
        {
          "key": "type",
          "data": {
            "placeholder": "消息种类",
            "options": typeOptions
          },
          "type": "Select",
          "subscribe": {
            "key": "msgType",
            "match": value => value !== undefined,
            "success": ["clear", function (value, subscriber) {
              if (value === 0) {
                subscriber.data.options = typeOptions
              } else if (value === 1) {
                subscriber.data.options = typeOptions2
              }
            }],
            "error": "clear"
          }
        }
      ]
    }
  },
  "buttons": {
    "searchButton": {
      "useButtonConfig": "searchButton",
      "beforeAction"(data) {
        sensorsList.sfzc_message_history_search(data.type ? this.searchForm.getFormItem('type').data.options.find((item) => item.value === data.type).label : undefined)
        return true
      }
    }
  },
  "buttonGroup": [
    "searchButton"
  ],
}

export const config = {
  "apis": {
    "searchApi": {
      "method": "post",
      "url": "/admin/getUnReadSysMsgList",
      "handleResult"(result) {
        if (result.code === 0 && result.result.length)
        this.sendApi({
          "url": "/admin/updateSysMsgForRead",
          "success"() {
            this.sendApi({
              "url": "/admin/sysMessageRemind",
              "success"(result) {
                if (result.code === 0) {
                  this.$store.commit('app/setNotifyNum', result.result.count || 0)
                }
              }
            })
          }
        }, {
          "msgIds": result.result.map((item) => item.msgId)
        })
        return result
      }
    }
  },
  "tableConfig": {
    "columns": columns,
    "pagination": {
      "notPagination": true
    },
    "config": {}
  },
  "forms": {
    "searchForm": {
      "formItemWidth": 120,
      "labelType": "Search",
      "key": "searchForm",
      "data": []
    }
  },
  "buttonGroup": [
    "historyButton"
  ],
  "buttons": {
    "historyButton": {
      "key": "historyButton",
      "label": "历史消息",
      "type": "primary",
      "actionType": "dialog",
      "dialogKey": "historyDialog",
      "beforeAction"() {
        sensorsList.sfzc_message_history()
        return true
      }
    }
  },
  "dialogs": {
    "historyDialog": {
      "key": "historyDialog",
      "title": "历史消息",
      "type": "table",
      "width": "1000px",
      "showSubmit": false,
      "prop": historyConfig
    }
  }
}