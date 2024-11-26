<!-- eslint-disable -->
<template>
  <div class="systemTab">
    <el-tabs v-model="currentTab" type="card" @tab-change="switchTab" @tab-remove="removeTab">
      <el-tab-pane v-for="item in tabs" :key="item.id" :label="item.tabName" :name="item.id" :closable="tabs.length > 1"></el-tab-pane>
    </el-tabs>
    <div class="refresh" @click="refresh">
      <el-icon><Refresh /></el-icon>&nbsp;刷新
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import { Setting } from '@element-plus/icons-vue'
import { sensorsList } from '@/utils/sensors'
import { TABSKEY } from '@/utils/auth'
import bus from '@/utils/bus'
const defaultTab = []

export default {
  name: 'SystemTabs',
  components: {
    Setting
  },
  data() {
    return {
      tabs: [],
      currentTab: undefined
    }
  },
  watch: {
    $route() {
      const tab = this.findTab()
      if (tab) {
        this.setCurrentTab(tab)
      } else {
        const targetRouter = this.getCurrentTargetRouter()
        if (targetRouter.meta.noTab) return
        this.setSystemTabs(targetRouter)
      }
    } 
  },
  mounted() {
    const tabs = JSON.parse(localStorage.getItem(TABSKEY) || JSON.stringify(defaultTab))
    this.tabs = tabs
    const tab = this.findTab()
    if (tab) {
      this.setCurrentTab(tab)
    } else {
      this.setSystemTabs(this.getCurrentTargetRouter())
    }
    bus.on('closeCurrentTab', (path) => {
      const closeTab = this.tabs.find(item => item.path === path)
      this.removeTab(closeTab.id)
    })
  },
  methods: {
    setCurrentTab(tab) {
      this.$emit('refresh-tab', tab.id)
      this.currentTab = tab.id
    },
    getCurrentTargetRouter() {
      const { currentRoute } = this.$router
      return this.handleRouter(currentRoute.value)
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
      const index = this.findTabIndexFromName(tab.name)
      if (index > -1 && !tab.meta?.multi) {
        this.spliceSystemTabs(index)
      }
      this.tabs.push(tab)
      this.setCurrentTab(tab)
      localStorage.setItem(TABSKEY, JSON.stringify(this.tabs))
    },
    spliceSystemTabs(index) {
      this.tabs.splice(index, 1)
      localStorage.setItem(TABSKEY, JSON.stringify(this.tabs))
    },
    switchTab(id) {
      const tab = this.findTabFromId(id)
      this.$router.push(tab.fullPath)
    },
    removeTab(id) {
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
      const currentTab = this.findTabFromId(this.currentTab)
      const currentTabIndex = this.findTabIndexFromId(this.currentTab)
      const newTab = this.handleRouter(currentTab)
      this.tabs.splice(currentTabIndex, 1, newTab)
      this.currentTab = newTab.id
      this.$emit('refresh-tab', newTab.id)
    },
    findTabFromId(id) {
      return this.tabs.find(item => item.id === id)
    },
    findTabIndexFromId(id) {
      return this.tabs.findIndex(item => item.id === id)
    },
    findTabIndexFromName(name) {
      return this.tabs.findIndex(item => item.name === name)
    },
    findTab(route = this.$route) {
      return this.tabs.find(item => {
        const { meta, fullPath, query } = route
        if (item.fullPath === fullPath) {
          return true
        }
        return false
      })
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
    }
  }
}
</script>

<style lang="scss">
.systemTab {
  height: 36px;
  line-height: 36px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  // background-color: #ebf4ff;
  border-radius: 12px 12px 0 0;
  box-sizing: border-box;
  // border: 1px solid rgba(255, 255, 255, 0.8);
  border-bottom: none;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: -1px;
    height: 30px;
    bottom: -30px;
    // background-color: #ebf4ff;
    border-left: 1px solid rgba(255, 255, 255, 0.8);
    border-right: 1px solid rgba(255, 255, 255, 0.8);
  }
  .el-tabs--card {
    width: calc(100% - 40px);
  }
  .el-tabs--card > .el-tabs__header {
    border-bottom: none;
    margin-bottom: 0;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-bottom: none;
    border-radius: 12px 14px 0 0;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__nav-wrap {
    position: absolute;
    top: 0;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__item {
    border: none;
    position: relative;
    border-radius: 12px 12px 0 0;
    font-weight: normal;
    color: #5580b9;
    line-height: 35px;
    height: 35px;
    &::after {
      content: '';
      background-color: #bed3ef;
      width: 1px;
      height: 16px;
      position: absolute;
      right: 0;
      top: 9px;
    }
    &:last-child:not(.is-active):after {
      display: none;
    }
    &:hover {
      transition: all 0.3s ease;
      background-color: rgba(#d5dce5, 0.2);
    }
    &.is-active {
      background: #fff !important;
      margin-left: -1px;
      &::before,
      &::after {
        content: '';
        width: 8px;
        height: 8px;
        position: absolute;
        bottom: 0;
        top: auto;
      }
      &::before {
        left: -8px;
        background: url(../../assets/img/tab-left.png) no-repeat center;
        background-size: 8px 8px;
      }
      &::after {
        right: -8px;
        background: url(../../assets/img/tab-right.png) no-repeat center;
        background-size: 8px 8px;
      }
      &:first-child {
        height: 100px;
        align-items: baseline;
        &::after {
          top: 27px;
        }
      }
    }
  }
  .refresh {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    color: #7c8c9d;
    cursor: pointer;
    margin-right: 20px;
    &:hover {
      transition: all 0.3s ease;
      background-color: rgba(#d5dce5, 0.2);
    }
  }
  .el-tabs__nav-next,
  .el-tabs__nav-prev {
    line-height: 38px;
    box-shadow: 0 0 15px rgba(#000, 0.1);
  }
}
</style>
