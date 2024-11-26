import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './styles/element-variables.scss'
import ElementPlus from 'element-plus'

import zhCn from 'element-plus/es/locale/lang/zh-cn'

import lcode from '@lcode/components-vue3'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import './styles/index.scss'
import './assets/fonts/iconfont.css'

import injectLcode from './lcode'

const app = createApp(App)

app.use(store)
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(lcode);
app.use(router)

injectLcode(app)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
