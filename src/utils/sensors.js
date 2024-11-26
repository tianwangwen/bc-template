import store from '@/store'
import { handleTreeToList } from '@/utils/tools'
import router from '@/router'

export function doSensors (params, type = 'pc_clk') {
  const initSensorsData = {
    clk_value: store.state.user.info.userCode,
    url: window.location.href
  }
  Object.assign(initSensorsData, params)
  window.Sensors.track(type, initSensorsData)
}

export const sensorsList = {
  huixtj_testingList_search (clk_value1, clk_value2, clk_value3, clk_value4, clk_value5, clk_value6, clk_value7) {
    doSensors({
      tgt_event_id: 'huixtj_testingList_search',
      tgt_name: `质检列表-搜索`,
      clk_value1,
      clk_value2,
      clk_value3,
      clk_value4,
      clk_value5,
      clk_value6,
      clk_value7,
    })
  },
  huixtj_testingList_qualityTesting (clk_value1, clk_value2, clk_value3, clk_value4, clk_value5) {
    doSensors({
      tgt_event_id: 'huixtj_testingList_qualityTesting',
      tgt_name: `质检列表-质检`,
      clk_value1,
      clk_value2,
      clk_value3,
      clk_value4,
      clk_value5,
    })
  },
  huixtj_testingList_qualityTesting_positioning (position, clk_value1, clk_value2, clk_value3, clk_value4) {
    doSensors({
      tgt_event_id: 'huixtj_testingList_qualityTesting_positioning',
      tgt_name: `质检列表-质检-${position}`,
      clk_value1,
      clk_value2,
      clk_value3,
      clk_value4,
    })
  },
  huixtj_testingList_details_positioning (position, clk_value1, clk_value2, clk_value3, clk_value4, clk_value5, clk_value6, clk_value7) {
    doSensors({
      tgt_event_id: 'huixtj_testingList_details_positioning',
      tgt_name: `全量数据查询-质检详情-${position}`,
      clk_value1,
      clk_value2,
      clk_value3,
      clk_value4,
      clk_value5,
      clk_value6,
      clk_value7,
    })
  },
  huixtj_testingList_qualityTesting_submit (clk_value1, clk_value2, clk_value3, clk_value4, clk_value5, clk_value6, clk_value7) {
    doSensors({
      tgt_event_id: 'huixtj_testingList_qualityTesting_submit',
      tgt_name: `质检列表-质检-提交`,
      clk_value1,
      clk_value2,
      clk_value3,
      clk_value4,
      clk_value5,
      clk_value6,
      clk_value7,
    })
  },
  huixtj_testingList_details (clk_value1, clk_value2, clk_value3, clk_value4, clk_value5) {
    doSensors({
      tgt_event_id: 'huixtj_testingList_details',
      tgt_name: `质检列表-查看详情`,
      clk_value1,
      clk_value2,
      clk_value3,
      clk_value4,
      clk_value5,
    })
  },
  huixtj_dataQuery_search (clk_value1, clk_value2, clk_value3, clk_value4, clk_value5, clk_value6, clk_value7) {
    doSensors({
      tgt_event_id: 'huixtj_dataQuery_search',
      tgt_name: `全量数据查询-查询`,
      clk_value1,
      clk_value2,
      clk_value3,
      clk_value4,
      clk_value5,
      clk_value6,
      clk_value7,
    })
  },
  huixtj_dataQuery_allocation_1 (data) {
    const clk_value1 = data.map((item) => item.seatsName).join(';')
    const clk_value2 = data.map((item) => item.uid).join(';')
    doSensors({
      tgt_event_id: 'huixtj_dataQuery_allocation',
      tgt_name: `全量数据查询-分配`,
      clk_value1,
      clk_value2,
    })
  },
  huixtj_dataQuery_allocation_confirm_1 (data, clk_value3) {
    const clk_value1 = data.map((item) => item.seatsName).join(';')
    const clk_value2 = data.map((item) => item.uid).join(';')
    doSensors({
      tgt_event_id: 'huixtj_dataQuery_allocation_confirm',
      tgt_name: `全量数据查询-分配-确认`,
      clk_value1,
      clk_value2,
      clk_value3,
    })
  },
  huixtj_dataQuery_allocation_fail_1 (data, clk_value3) {
    const clk_value1 = data.map((item) => item.seatsName).join(';')
    const clk_value2 = data.map((item) => item.uid).join(';')
    doSensors({
      tgt_event_id: 'huixtj_dataQuery_allocation_fail',
      tgt_name: `全量数据查询-分配-失败提示`,
      clk_value1,
      clk_value2,
      clk_value3,
    })
  },
  huixtj_dataQuery_rule_1 (data, clk_value3) {
    const clk_value1 = data.map((item) => item.seatsName).join(';')
    const clk_value2 = data.map((item) => item.uid).join(';')
    doSensors({
      tgt_event_id: 'huixtj_dataQuery_rule',
      tgt_name: `全量数据查询-规则分配`,
      clk_value1,
      clk_value2,
      clk_value3,
    })
  },
  huixtj_dataQuery_rule_confirm_1 (clk_value1, data, list, inspectorIds, clk_value5) {
    const clk_value2 = data.map((item) => item.uid).join(';')
    const clk_value3 = list.map((item) => item[0]).join(';')
    const clk_value4 = inspectorIds.join(';')
    doSensors({
      tgt_event_id: 'huixtj_dataQuery_rule_confirm',
      tgt_name: `全量数据查询-规则分配-确认`,
      clk_value1,
      clk_value2,
      clk_value3,
      clk_value4,
      clk_value5,
    })
  },
  // 暂时未加, 确认规则小于
  huixtj_dataQuery_rule_confirmLess (clk_value1, clk_value2, clk_value3, clk_value4, clk_value5) {
    doSensors({
      tgt_event_id: 'huixtj_dataQuery_rule_confirmLess',
      tgt_name: `全量数据查询-规则分配-小于确认`,
      clk_value1,
      clk_value2,
      clk_value3,
      clk_value4,
      clk_value5,
    })
  },
  huixtj_dataQuery_recording (clk_value1) {
    doSensors({
      tgt_event_id: 'huixtj_dataQuery_recording',
      tgt_name: `全量数据查询-上传录音`,
      clk_value1,
    })
  },
  huixtj_dataQuery_recording_confirm (clk_value1) {
    doSensors({
      tgt_event_id: 'huixtj_dataQuery_recording_confirm',
      tgt_name: `全量数据查询-上传录音-确认`,
      clk_value1,
    })
  },
  huixtj_dataQuery_details (clk_value1, clk_value2, clk_value3, clk_value4, clk_value5) {
    doSensors({
      tgt_event_id: 'huixtj_dataQuery_details',
      tgt_name: `全量数据查询-质检详情`,
      clk_value1,
      clk_value2,
      clk_value3,
      clk_value4,
      clk_value5,
    })
  },
  huixtj_dataQuery_details_positioning (position, clk_value1, clk_value2, clk_value3, clk_value4, clk_value5, clk_value6, clk_value7) {
    doSensors({
      tgt_event_id: 'huixtj_dataQuery_details_positioning',
      tgt_name: `全量数据查询-质检详情-${position}`,
      clk_value1,
      clk_value2,
      clk_value3,
      clk_value4,
      clk_value5,
      clk_value6,
      clk_value7,
    })
  },
  huixtj_dataQuery_allocation_2 () {
    doSensors({
      tgt_event_id: 'huixtj_dataQuery_allocation',
      tgt_name: `消息中心-查看`,
    })
  },
  huixtj_dataQuery_allocation_confirm_2 () {
    doSensors({
      tgt_event_id: 'huixtj_dataQuery_allocation_confirm',
      tgt_name: `消息中心-未读`,
    })
  },
  huixtj_dataQuery_allocation_fail_2 () {
    doSensors({
      tgt_event_id: 'huixtj_dataQuery_allocation_fail',
      tgt_name: `消息中心-已读`,
    })
  },
  huixtj_dataQuery_rule_confirm_2(){
    doSensors({
      tgt_event_id: 'huixtj_dataQuery_rule_confirm',
      tgt_name: `消息中心-已读`,
    })
  },
  huixtj_dataQuery_rule_confirmLess_2 (data) {
    const { startTime, endTime, groupAndUserIds } = data
    const clk_value1 = (groupAndUserIds || []).map(i => i.groupId).join(';')
    const clk_value2 = (groupAndUserIds || []).map(i => i.mediateIds.map(j => j)).join(';')
    const clk_value3 = (startTime || '') + '-' + (endTime || '')
      doSensors({
        tgt_event_id: 'huixtj_dataQuery_rule_confirmLess',
        tgt_name: `质检统计表-搜索`,
        clk_value1,
        clk_value2,
        clk_value3,
      })
  },
  huixtj_dataQuery_rule_exporting (data) {
    const { startTime, endTime, groupAndUserIds } = data
    const clk_value1 = (groupAndUserIds || []).map(i => i.groupId).join(';')
    const clk_value2 = (groupAndUserIds || []).map(i => i.mediateIds.map(j => j)).join(';')
    const clk_value3 = (startTime || '') + '-' + (endTime || '')
      doSensors({
        tgt_event_id: 'huixtj_dataQuery_recording',
        tgt_name: `质检统计表-导出`,
        clk_value1,
        clk_value2,
        clk_value3,
      })
  }
}
