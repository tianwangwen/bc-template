import {
  injectAxios,
  injectAxiosResultHandle,
  injectSearchResultHandle,
  injectTablePaginationConfig,
  injectVariables,
  injectGetFormValueHandle,
  injectValidateMethod,
  injectDialogs,
  injectFormItemConfig,
  injectTableSortHandle,
  injectFormItem,
  injectButtons,
  injectFormLabelCharacterWidth
} from '@lcode/components-utils'
import axios from '@/network'
import Upload from '@/components/Dialogs/Upload/index.vue'
import FormItemUpload from '@/components/FormItem/Upload.vue'
import * as enmuList from './enmu'
import dayjs from 'dayjs'
import iconCreate from '@/assets/img/icon-create.png'

export default function (app) {
  injectAxios(axios)
  injectFormLabelCharacterWidth(14)

  injectAxiosResultHandle(function (result, api = {}) {
    if (result.code === 0) {
      return {
        ...result,
        data: result.result || []
      }
    } else if (!api.error) {
      this.$message.error(result.message)
    }
  })

  injectSearchResultHandle(result => {
    if (Array.isArray(result.result)) {
      // 后端不分页场景
      return {
        data: result.result || [],
        total: result.result.length
      }
    }
    return {
      data: result.result.data || [],
      total: result.result.totalCount
    }
  })

  injectTableSortHandle(data => ({
    orders: [
      {
        hasAsc: data.order === 'ascending' ? true : false,
        column: data.prop
      }
    ]
  }))

  injectTablePaginationConfig({
    fields: ['pageNo', 'pageSize'],
    pageSizes: [10, 50, 100, 200, 500, 600, 800],
    size: "small",
    background: true,
    layout: 'total, prev, pager, next, sizes, jumper'
  })

  const getVariable = key => ({
    key,
    type: 'custom',
    value: enmuList[key]
  })
  injectVariables({
    stateVariable: getVariable('stateVariable'),// 启用禁用状态
  })

  injectButtons({
    "createButton": {
      key: 'createButton',
      label: '新增',
      actionType: 'dialog',
      dialogKey: 'createDialog',
      btnType: 'jsx',
      jsx() {
        const onClick = () => {
          this.$emit('click')
        }
        return (
          <el-button onClick={onClick}>
            <img style='width: 16px;margin-right: 4px' src={iconCreate} alt='' />
            新增
          </el-button>
        )
      }
    },
    "enableButton": {
      "label": "启用",
      "type": "primary",
      "link": true,
      "actionType": "api",
      "apiKey": "enableApi",
      "onCallback": ['onSearch', 'showSuccessMessage'],
      "if"(data) {
        return data.state === 0;
      }
    },
    "disableButton": {
      "label": "禁用",
      "type": "primary",
      "link": true,
      "actionType": "dialog",
      "dialogKey": "disableDialog",
      "if"(data) {
        return data.state === 1;
      }
    },
    "deleteButton": {
      key: 'deleteButton',
      label: '删除',
      type: 'danger',
      link: true,
      actionType: 'dialog',
      dialogKey: 'deleteDialog',
      onCallback: ['onSearch', 'showSuccessMessage']
    },
    "exportButton": {
      key: 'exportButton',
      label: '导出',
      type: 'primary',
      actionType: 'api',
      apiKey: 'exportApi',
    }
  })

  injectGetFormValueHandle({
    rangeValue(value, target, item, data, handleGetValueParams = {}) {
      if (!value || !(typeof value === 'object')) return
      const minKey = Array.isArray(handleGetValueParams) ? handleGetValueParams[0] : handleGetValueParams.minKey
      const maxKey = Array.isArray(handleGetValueParams) ? handleGetValueParams[1] : handleGetValueParams.maxKey
      target[minKey] = value.min
      target[maxKey] = value.max
    },
    splitValue: function (value, target, item, formData, handleGetValueParams) {
      if (!value) return
      target[item.key] = [
        ...new Set(
          value
            .replace(/[\n\s;,]/g, ',')
            .split(',')
            .filter(item => item)
        )
      ]
    },
    date(value, target, item, data, params = ['startTime', 'endTime']) {
      if (Array.isArray(value)) {
        target[params[0]] = dayjs(value[0]).format('YYYY-MM-DD')
        target[params[1]] = dayjs(value[1]).format('YYYY-MM-DD')
      } else {
        target[item.key] = value
      }
    },
  })
  injectValidateMethod({
    emptyText: {
      rule: value => !(value === undefined || value === ''),
      message: '请选择'
    },
    positiveInteger: {
      rule: value => !value || /^[0-9]\d*$/g.test(value),
      message: '请输入正整数'
    },
  })

  injectDialogs(app, {
    upload: Upload,
  })

  injectFormItem(app, {
    upload: FormItemUpload,
  })

  injectFormItemConfig({
    rangeInput: {
      type: 'Range',
      data: {
        value: {},
        type: 'number',
        split: '-',
        clearable: true
      },
      handleGetValue(value, target, item, data) {
        if (!item.submitKeys) {
          target[item.key] = value
        } else {
          target[item.submitKeys[0]] = value.min === '' ? undefined : value.min
          target[item.submitKeys[1]] = value.max === '' ? undefined : value.max
        }
      },
      handleSetValue(value, item, data, formData) {
        if (!item.submitKeys) {
          item.data.value = value
        } else {
          item.data.value.min = data[item.submitKeys[0]]
          item.data.value.max = data[item.submitKeys[1]]
        }
      }
    },
  })
}
