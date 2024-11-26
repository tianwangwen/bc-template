import { createStore } from 'vuex'
import getters from './getters'

const modulesFiles = import.meta.globEager('./modules/**/*.ts')
const pathList = []

for (const path in modulesFiles) {
  pathList.push(path)
}

const modules = pathList.reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/modules\/(.*)\.\w+$/, '$1')
  const value = modulesFiles[modulePath]
  modules[moduleName] = value.default
  return modules
}, {})

const isDev = import.meta.env.MODE !== 'production'
const store = createStore({
  modules,
  getters,
  strict: isDev
})

export default store
