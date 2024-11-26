import {
  injectAxios,
  injectAxiosResultHandle,
  injectSearchResultHandle,
  injectTablePaginationConfig,
  injectVariables,
  injectApiConfig,
  injectGetFormValueHandle,
  injectValidateMethod,
  injectFormItemConfig,
  injectTableSortHandle,
  injectFormLabel,
  injectTableColumnConfig,
  injectFormItem,
} from '@lcode/components-utils'
import axios from '@/network'
import TipNormal from '@/components/FormLabel/TipNormal.vue'
import Range from '@/components/FormItem/Range.jsx'
import * as enmuList from './enmu'
import { formatNumberStripEndZero } from '../utils/tools'

export default function (app) {
  injectAxios(axios)

  injectAxiosResultHandle(function (result, api = {}) {
    if (result.code === 0) {
      return {
        ...result,
        data: result.result
      }
    } else if (!api.error) {
      this.$message.error(result.message)
    }
  });

  injectSearchResultHandle((result) => {
    if (Array.isArray(result.result)) { // 后端不分页场景
      return {
        data: result.result,
        total: result.result.length
      }
    }
    return {
      data: result.result.data,
      total: result.result.totalCount
    }
  });

  injectTableSortHandle((data) => ({
    orders: [{
      hasAsc: data.order === 'ascending' ? true : false,
      column: data.prop
    }]
  }))

  injectTablePaginationConfig({
    fields: ['pageNo', 'pageSize']
  })

  const getVariable = (key) => ({
    key,
    type: 'custom',
    value: enmuList[key]
  })

  injectVariables({
    "repaymentModeVariable": getVariable("repaymentModeVariable"),
  })

  injectApiConfig({
    "companyGroupListApi": {
      "method": "get",
      "url": "/admin/getCompanyGroupList"
    },
  })

  injectGetFormValueHandle({
    rangeValue(value, target, item, data, handleGetValueParams = {}) {
      if (!value || !(typeof value === 'object')) return
      const minKey = Array.isArray(handleGetValueParams) ? handleGetValueParams[0] : handleGetValueParams.minKey
      const maxKey = Array.isArray(handleGetValueParams) ? handleGetValueParams[1] : handleGetValueParams.maxKey
      target[minKey] = value.min
      target[maxKey] = value.max
    },
    splitValue: function (value, target, item) {
      if (!value) return
      target[item.key] = [...new Set(value.replace(/[\n\s;,]/g, ',').split(',').filter((item) => item))];
    }
  })

  injectValidateMethod({
    emptyText: {
        rule: value => !(value === undefined || value === ''),
        message: '请选择'
    },
    positiveInteger: {
      rule: value => (!value || /^[1-9]\d*$/g.test(value)),
      message: '请输入正整数'
    }
  })

  injectFormItem(app, {
    Range: Range
  })

  injectFormItemConfig({
    rangeInput: {
      "type": "Range",
      "data": {
        "value": {},
        "type": "number",
        "split": "-",
        "clearable": true,
      },
      "handleGetValue"(value, target, item, data) {
        if (!item.submitKeys) {
          target[item.key] = value
        } else {
          target[item.submitKeys[0]] = value.min === '' ? undefined :value.min
          target[item.submitKeys[1]] = value.max === '' ? undefined :value.max
        }
      },
      "handleSetValue"(value, item, data, formData) {
        if (!item.submitKeys) {
          item.data.value = value
        } else {
          item.data.value.min = data[item.submitKeys[0]]
          item.data.value.max = data[item.submitKeys[1]]
        }
      }
    }
  })

  injectFormLabel(app, {
    tipNormal: TipNormal
  })

  injectTableColumnConfig({
    formatNumberStripEndZero: { // 数字格式化： 1000000 => 1,000,00.00
      colType: 'render',
      render: value => formatNumberStripEndZero(value, 2)
    },
    percent: { // 转化为百分比： 0.1 => 10%
      colType: 'render',
      render: value => (value || value === 0) ? Math.round(value * 100) + '%' : '--'
    },
    "booleanCol": {
      "colType": "render",
      "render": value => value === true ? '是' : (value === false ? '否' : '')
    },
  })
  
}
