<template>
  <div class="layout">
    <el-container>
      <el-aside class="aside" :width="sidebarOpened ? '220px' : '60px'">
        <div class="logo">{{ sidebarOpened ? '智借催收系统' : '智借' }}</div>
        <div class="search"><el-input ref="searchRef" size="small" v-model="searchValue" clearable placeholder="搜索菜单(ctrl + shift + f)"></el-input></div>
        <Sidebar :data="targetMenu" />
      </el-aside>
      <div class="hamburger-container" @click="toggleClick" :class="{ 'is-fold': sidebarOpened }" >
        <img src="../assets/img/slide.png" class="hamburger" alt="滑动块" />
      </div>
      <el-container>
        <el-header>
          <Header :info="info" />
        </el-header>
        <SystemTabs ref="tabs" @refresh-tab="onRefreshTab" />
        <el-main>
          <div id="main" class="main" :class="{ 'app-bg': useAppBg }">
            <router-view v-slot="{ Component }">
              <keep-alive :exclude="exc">
                <component v-if="showCompoent" :is="Component" :key="refreshKey || Component.key" />
              </keep-alive>
            </router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { computed, provide, ref, watch, onBeforeUnmount, onMounted, nextTick } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from 'vue-router'
import Sidebar from "./components/sidebar.jsx";
import Header from "./components/header.vue";
import SystemTabs from "@/components/SystemTabs/index.vue";
import { login, clearTabs } from '@/utils/auth';
import { handleTreeToList } from '@/utils/tools';
const store = useStore();
const router = useRouter()

const exc = ref(['CaseListDetailsCall'])
const showCompoent = ref(true)
const refreshKey = ref()

// 两种刷新：当前页面刷新、路由变化刷新
const onRefreshTab = (id, isCurrent = false) => {
  if (isCurrent) { // tab切换
    refreshKey.value = id
  } else { // 刷新当前页面
    const currentRoute = router.currentRoute.value;
    currentRoute.matched.forEach((r)=>{
      if(r.name === currentRoute.name){
        //获取到当前页面的name
        const comName = r.components.default.name;
        if(comName != undefined){
          exc.value.push(comName);
          showCompoent.value = false
        }
      }
    })
    nextTick(()=>{
      showCompoent.value = true
      exc.value.pop()
    })
  }
}

const searchValue = ref()
const token = computed(() => store.state.user.token);
const info = computed(() => store.state.user.info);
const menuTree = computed(() => store.state.user.menuTree);
const sidebarOpened = computed({
  get: () => store.state.app.sidebarOpened,
  set(value) {
    store.commit('app/setSidebarOpened', value)
  }
});

const searchRef = ref()

if (!token) {
  clearTabs()
  login()
} else if (!info.id) {
  store.dispatch("user/getInfo");
  store.dispatch("user/getMenuTree")
}

const route = useRoute()
const useAppBg = computed(() => {
  return route.meta['ignoreAppBg'] === undefined || route.meta['ignoreAppBg'] === false
})

const toggleClick = () => {
  sidebarOpened.value = !sidebarOpened.value
}

const tabs = ref()
provide('tabs', tabs)

const targetMenu = computed(() => {
  if (!searchValue.value) return menuTree.value
  const list = handleTreeToList(menuTree.value)
  const target = list.filter((item) => {
    return item.name.includes(searchValue.value)
  })
  return target
})

const handleKeyUp = (event) => {
  if (event.ctrlKey && event.shiftKey && (event.key === 'ƒ' || event.key === 'F')) {
    searchRef.value.focus()
  }
}
onMounted(() => {
  document.addEventListener('keyup', handleKeyUp)
})
onBeforeUnmount(() => {
  document.removeEventListener('keyup', handleKeyUp)
})
</script>

<style lang="scss" scoped>
.layout {
  background-color: $bg;
  .logo {
    height: $headerHeight;
    background-color: #001628;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: bold;
    overflow: hidden;
    white-space: nowrap;
  }
  .search {
    padding: 4px 16px 20px;
    background-color: #001628;
    ::v-deep {
      .el-input__wrapper {
        background-color: #001628;
        box-shadow: 0 0 0 1px rgba(#bfcbd9, 0.6) inset;
        .el-input__inner {
          color: white;
        }
      }
    }
  }
  .main {
    height: calc(100vh - $headerHeight - 24px - 32px);
    overflow-y: auto;
  }
  .app-bg {
    background-color: #ffffff;
    border: 1px solid #e6eaed;
    border-radius: 8px;
    box-sizing: border-box;
    padding: 16px 20px 24px;
  }
  .aside {
    transition: all 0.3s;
    height: 100vh;
    overflow-y: auto;
  }
  .slider-menu {
    :deep {
      .el-sub-menu__title {
        transition: all 0.3s ease;
        &:hover {
          background: #04123b;
        }
      }
      .el-menu-item {
        transition: all 0.3s ease;
        &:hover {
          background: linear-gradient(270deg, rgba(21, 40, 79, 0) 0%, rgba(55, 129, 225, 0.3) 100%);
        }
      }
    }
  }
  .hamburger-container {
    line-height: 46px;
    height: 10px;
    width: 25px;
    cursor: pointer;
    transition: 0.3s ease;
    -webkit-tap-highlight-color: transparent;
    position: absolute;
    top: 45%;
    left: 60px;
    z-index: 9;
  }
  .hamburger {
    display: inline-block;
    width: 13px;
    height: 30px;
    vertical-align: middle;
    cursor: pointer;
  }
  .is-fold {
    left: 220px;
    transition: 0.3s ease;
  }
}
</style>

