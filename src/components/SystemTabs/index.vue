<template>
  <div class="systemTab">
    <div class="left">
      <div class="switchBtn" @click="toPrevTab">
        <i class="icon-font icon-backward_left"></i>
      </div>
      <div class="tabs">
        <div :class="{tab: true, actived: tab.id === currentTab}" v-for="tab in tabs" :key="tab.id" @click="switchTab(tab.id)">
          <i class="flag" v-if="tab.id === flagId"></i>
          <p class="name">{{tab.tabName}}</p>
          <div @click.stop="removeTab(tab.id, tab)" class="close" v-show="tab.meta.closeable !== false">
            <img :src="tab.id === currentTab ? activedCloseIcon : closeIcon" style="width: 14px; height: 14px;" />
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="switchBtn" @click="toNextTab" style="transform: rotate(180deg)">
        <i class="icon-font icon-backward_left"></i>
      </div>
      <div class="refresh" @click="refresh">
        <i class="icon-font icon-refresh"></i>
        刷新
      </div>
      <div>
        <el-dropdown @command="handleCommand">
          <span class="dropdown-button">
            <el-icon>
              <Setting />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="(data, key) of tools" :key="key" :command="key">{{data}}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import closeIcon from '@/assets/img/icon-close.png'
import activedCloseIcon from '@/assets/img/icon-close-active.png'
import { Setting } from '@element-plus/icons-vue'
import { sensorsList } from '@/utils/sensors'

const TABSKEY = 'ddstp'

const defaultTab = []

const tools = {
  "1": "关闭其他标签页",
  "2": "关闭右侧标签页",
  "3": "关闭左侧标签页",
}

/**
 * 如果想要自定义某个tab的名称，需要在跳转路由时候增加 query 参数 systemTabName 即可
 */
export default {
  name: 'SystemTabs',
  components: {
    Setting
  },
  data() {
    return {
      tabs: [],
      closeIcon,
      activedCloseIcon,
      awaitCaseId: undefined,
      flagId: undefined,
      tools
    }
  },
  computed: {
    currentTab() {
      const tab = this.findTab() || {}
      this.$emit('refresh-tab', tab.id, true)
      return tab.id
    }
  },
  watch: {
    '$route'() {
      if (!this.findTab()) {
        const targetRouter = this.getCurrentTargetRouter()
        if (!targetRouter.meta.noTab) {
          this.setSystemTabs(targetRouter)
          if (!this.flagId && this.awaitCaseId) {
            this.setTabFlag(this.awaitCaseId, true)
          }
        }
      }
    }
  },
  created() {
    this.applyLocalStorageTabs()
  },
  methods: {
    getCurrentTargetRouter() {
      const { currentRoute } = this.$router
      return this.handleRouter(currentRoute._value)
    },
    getTabId({ fullPath }, tabName) {
      return fullPath + tabName + new Date().getTime()
    },
    getNextTargetTab(id) {
      const tabIndex = this.findTabIndexFromId(id)
      let targetTab
      if (this.tabs.length <= 1) {
        this.$router.push('/')
      } else if (tabIndex === 0) {
        targetTab = this.tabs[tabIndex + 1]
      } else {
        targetTab = this.tabs[tabIndex - 1]
      }
      return targetTab
    },
    setSystemTabs(tab) {
      if (tab.meta?.onlyOneTab) {
        const index = this.findTabIndexFromName(tab.name)
        if (index > -1) {
          this.spliceSystemTabs(index)
        }
      }
      this.tabs.push(tab)
      localStorage.setItem(TABSKEY, JSON.stringify(this.tabs))
    },
    setTabFlag(caseId, bool) {
      if (bool) {
        const tab = this.findTabFromCaseId(caseId) || {}
        if (!tab.id) { // 异步处理
          this.awaitCaseId = caseId
        } else {
          this.flagId = tab.id
        }
      } else {
        this.flagId = undefined
        this.awaitCaseId = undefined
      }
    },
    spliceSystemTabs(index) {
      this.tabs.splice(index, 1)
      localStorage.setItem(TABSKEY, JSON.stringify(this.tabs))
    },
    switchTab(id, type) {
      const tab = this.findTabFromId(id)
      this.$router.push(tab.fullPath)
      if (type) {
        sensorsList.sfzc_pageDown(1)
      } else {
        sensorsList.sfzc_change(tab.tabName)
      }
    },
    applyLocalStorageTabs() {
      const tabs = JSON.parse(localStorage.getItem(TABSKEY) || JSON.stringify(defaultTab))
      this.tabs = tabs
      if (!this.findTab()) {
        this.setSystemTabs(this.getCurrentTargetRouter())
      }
    },
    removeTab(id) {
      sensorsList.sfzc_close(this.findTabFromId(id).tabName)

      const tabIndex = this.findTabIndexFromId(id)
      if (id === this.currentTab) {
        const nextTargetTab = this.getNextTargetTab(id)
        this.$router.push(nextTargetTab.fullPath)
        setTimeout(() => {
          this.spliceSystemTabs(tabIndex)
        }, 0)
      } else {
        this.spliceSystemTabs(tabIndex)
      }
    },
    refresh() {
      this.$emit('refresh-tab')
      sensorsList.sfzc_pageDown(2)
    },
    findTabFromId(id) {
      return this.tabs.find((item) => item.id === id)
    },
    findTabIndexFromId(id) {
      return this.tabs.findIndex((item) => item.id === id)
    },
    findTabIndexFromName(name) {
      return this.tabs.findIndex((item) => item.name === name)
    },
    findTab(route = this.$route) {
      return this.tabs.find((item) => {
        const { fullPath } = route
        if (item.fullPath === fullPath) {
          return true
        }
        return false
      })
    },
    findTabFromCaseId(caseId) {
      if (!caseId) return
      return this.tabs.find((item) => item.params.dunCaseId === caseId)
    },
    handleRouter(currentRoute) {
      const { query, path, fullPath, hash, meta, name, params } = currentRoute
      const tabName = currentRoute.tabName || query.systemTabName || meta.title
      const id = this.getTabId(currentRoute, tabName)
      return {
        id,
        tabName,
        query,
        path,
        fullPath,
        hash,
        meta,
        name,
        params
      }
    },
    pushTab(route) {
      if (this.findTab(route)) return
      const targetRouter = this.handleRouter(route)
      if (targetRouter.meta.noTab) return
      this.setSystemTabs(targetRouter)
    },
    toPrevTab() {
      const currentTab = this.findTabFromId(this.currentTab)
      const currentTabIndex = this.findTabIndexFromId(this.currentTab)
      if (currentTabIndex !== 0) {
        const nextTabId = this.tabs[currentTabIndex - 1].id
        this.switchTab(nextTabId, 1)
      }
    },
    toNextTab() {
      const currentTabIndex = this.findTabIndexFromId(this.currentTab)
      if (currentTabIndex !== this.tabs.length - 1) {
        const nextTabId = this.tabs[currentTabIndex + 1].id
        this.switchTab(nextTabId, 2)
      }
    },
    handleCommand(command) {
      let list = []
      const currentTab = this.findTabFromId(this.currentTab)
      if (command === '1') {
        const newTab = this.handleRouter(currentTab)
        list = this.tabs.splice(0, this.tabs.length, newTab)
      } else if (command === '2') {
        const currentTabIndex = this.findTabIndexFromId(this.currentTab)
        const newTab = this.handleRouter(currentTab)
        list = this.tabs.splice(currentTabIndex, this.tabs.length, newTab)
      } else if (command === '3') {
        const currentTabIndex = this.findTabIndexFromId(this.currentTab)
        const newTab = this.handleRouter(currentTab)
        list = this.tabs.splice(0, currentTabIndex + 1, newTab)
      }
      localStorage.setItem(TABSKEY, JSON.stringify(this.tabs))
      sensorsList.sfzc_operation(tools[command], list.filter(item => item.id !== currentTab.id).map((item) => item.tabName).join('、'))
    }
  }
}
</script>

<style lang="scss">
.systemTab {
  height: 32px;
  line-height: 32px;
  display: flex;
  justify-content: space-between;
  background-color: #F5F7FA;
  font-size: 12px;
  .left, .right {
    display: flex;
    max-width: 100%;
    overflow: hidden;
  }
  .right {
    flex-shrink: 0;
  }
  .switchBtn {
    width: 32px;
    height: 32px;
    text-align: center;
    background-color: #E2ECF8;
    cursor: pointer;
    color: #8392ae;
    flex-shrink: 0;
  }
  .tabs {
    display: flex;
    overflow: hidden;
  }
  .tab {
    display: flex;
    padding: 0 12px 0 16px;
    color: #7C8C9D;
    cursor: pointer;
    border-right: 0.5px solid #DAE2EB;
    align-items: center;
    &:last-child {
      border-right: none;
    }
    &:hover {
      transition: all 0.3s ease;
      background-color: rgba(#D5DCE5, 0.2);
    }
  }
  .flag {
    position: relative;
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #da3025;
    padding: 2px;
    margin-right: 8px;
    &::before {
      content: "";
      position: absolute;
      top: -2px;
      left: -2px;
      width: 12px;
      height: 12px;
      border: 1px solid #da3025;
      border-radius: 50%;
    }
  }
  .name {
    overflow:hidden; //超出的文本隐藏
    text-overflow:ellipsis; //溢出用省略号显示
    white-space:nowrap; //溢出不换行
    min-width: 48px;
    text-align: center;
  }
  .actived {
    background-color: #D5DCE5 !important;
    color: #0D243E;
  }
  .refresh {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    color: #7C8C9D;
    cursor: pointer;
    &:hover {
      transition: all 0.3s ease;
      background-color: rgba(#D5DCE5, 0.2);
    }
  }
  .close {
    flex-shrink: 0;
    // transform: translateY(10px);
    width: 14px;
    height: 14px;
    line-height: 14px;
    margin-left: 4px;
    overflow: hidden;
    text-align: center;
    i {
      width: 100%;
      height: 100%;
      // transform: scale(0.7);
      display: block;
      font-size: 14px;
    }
  }
  .dropdown-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    color: #7C8C9D;
    cursor: pointer;
    height: 32px;
    border-left: 0.5px solid #DAE2EB;
    &:hover {
      transition: all 0.3s ease;
      background-color: rgba(#D5DCE5, 0.2);
    }
  }
}
</style>
