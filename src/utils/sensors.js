import store from '@/store'

export function doSensors(params, type = 'pc_clk') {
  const initSensorsData = {
    clk_value1: store.state.user.info.userName,
    url: window.location.href,
  };
  Object.assign(initSensorsData, params);
  (window.Sensors).track(type, initSensorsData);
  // console.log('initSensorsData -', initSensorsData)
}

export const sensorsList = {
  // 导航栏&起始页
  sfzc_navigation_priMenu(data) { doSensors({ tgt_event_id: 'sfzc_navigation_priMenu', tgt_name: `导航栏-一级菜单-${data}` }) },
  sfzc_navigation_subMenu() {
    const routeInfo = this.$route.matched[this.$route.matched.length - 1]
    const parentRouteInfo = this.$route.matched.length > 2 ? this.$route.matched[this.$route.matched.length - 2] : undefined
    doSensors({
      clk_value2: parentRouteInfo ? parentRouteInfo.meta.title : undefined,
      tgt_event_id: 'sfzc_navigation_subMenu',
      tgt_name: `导航栏-二级菜单-${routeInfo.meta.title}`
    })
  },
  sfzc_startpage_tabSwitch(data) { doSensors({ tgt_event_id: 'sfzc_startpage_tabSwitch', tgt_name: '起始页-tab切换', clk_value2: data }) },
  sfzc_close(data) { doSensors({ tgt_event_id: 'sfzc_close', tgt_name: 'tab切换栏-关闭', clk_value2: data }) },
  sfzc_change(data) { doSensors({ tgt_event_id: 'sfzc_change', tgt_name: 'tab切换栏-切换', clk_value2: data }) },
  sfzc_pageDown(data) { doSensors({ tgt_event_id: 'sfzc_pageDown', tgt_name: `tab切换栏-${data === 1 ? '翻页' : '刷新'}` }) },
  sfzc_operation(type, data) { doSensors({ tgt_event_id: 'sfzc_operation', tgt_name: `tab切换栏-${type}`, clk_value2: data }) },
  sfzc_logOut() { doSensors({ tgt_event_id: 'sfzc_logOut', tgt_name: '智借-退出' }) },
  sfzc_message() { doSensors({ tgt_event_id: 'sfzc_message', tgt_name: '智借-消息中心' }) },
  sfzc_message_history() { doSensors({ tgt_event_id: 'sfzc_message_history', tgt_name: '智借-消息中心-历史消息' }) },
  sfzc_message_history_search(type) { doSensors({ tgt_event_id: 'sfzc_message_history_search', tgt_name: '智借-消息中心-历史消息-搜索', clk_value2: type }) },
  sfzc_message_history_search_download(type, time, content) { doSensors({ tgt_event_id: 'sfzc_message_history_search_download', tgt_name: '智借-消息中心-历史消息-失败记录下载', clk_value2: type, clk_value3: time, clk_value4: content }) },
}
