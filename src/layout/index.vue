<template>
  <div class="layout">
    <Header :info="info" @new-msg-come="onNewMsgCome" />
    <el-container>
      <el-aside class="aside" width="210px">
        <Sidebar :data="menuTree" />
      </el-aside>
      <el-container style="flex-direction: column">
        <SystemTabs ref="tabs" @refresh-tab="onRefreshTab" />
        <el-main style="z-index: 1">
          <div id="main" class="main app-bg">
            <router-view v-slot="{ Component }">
              <keep-alive>
                <component :is="Component" :key="currentTab" />
              </keep-alive>
            </router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { computed, provide, ref, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from './components/sidebar.jsx'
import Header from './components/header.vue'
import SystemTabs from '@/components/SystemTabs/index.vue'
import { clearTabs } from '@/utils/auth'

const store = useStore()
const route = useRoute()
const router = useRouter()

const token = computed(() => store.state.user.token)
const info = computed(() => store.state.user.info)
const menuTree = computed(() => store.state.user.menuTree)

const tabs = ref()
const currentTab = ref('')

const onRefreshTab = id => {
  currentTab.value = id
}

const routeChange = () => {
  const needLogin = route.meta.needLogin
  const permCode = route.meta.code
  const perms = store.state.user.perms
  if (needLogin && !perms.includes(permCode)) {
    router.push('/403')
  }
}

const onNewMsgCome = () => {
  if (route.path === '/message') {
    tabs.value.refresh()
  }
}

onMounted(() => {
  store.dispatch('user/getInfo')
  if (!token.value) {
    clearTabs()
  } else if (!info.value.id) {
    store.dispatch('user/getInfo').then(() => {
      store.dispatch('user/getUserMenu').then(routeChange)
    });
  } else {
    store.dispatch('user/getUserMenu').then(routeChange)
  }
})

provide('tabs', tabs)
</script>

<style lang="scss">
#app .el-main {
  padding: 0 3px 0 0;
  margin-right: 20px;
  border-radius: 12px 12px 0 0;
  background: #fff;
}
.layout {
  background-color: #f0f4f9;
  background-image: url(../assets/img/bg.png);
  background-repeat: no-repeat;
  background-size: 100% auto;
  .main {
    height: calc(100vh - $headerHeight - 32px);
    overflow-y: auto;
  }
  .app-bg {
    background-color: #ffffff;
    border: 1px solid #fff;
    border-radius: 12px 12px 8px 8px;
    box-sizing: border-box;
    padding: 16px 24px 15px 24px;
  }
  .aside {
    transition: all 0.3s;
    height: 100vh;
    overflow-y: auto;
    padding: 0 16px;
    box-sizing: border-box;
    height: calc(100vh - 66px);
    .el-menu {
      height: auto;
    }
  }
  .slider-menu {
    .el-sub-menu__title {
      transition: all 0.3s ease;
    }
    .el-menu-item,
    .el-sub-menu {
      transition: all 0.3s ease;
      .menu-icon {
        display: inline-block;
        background-repeat: no-repeat;
        width: 16px;
        height: 16px;
        background-size: 16px 16px;
        &-Report {
          background-image: url(../assets/img/report_0.png);
        }
        &-Monitor {
          background-image: url(../assets/img/wb_0.png);
        }
        &-Interview {
          background-image: url(../assets/img/interview_0.png);
        }
        &-Config {
          background-image: url(../assets/img/config_0.png);
        }
      }
      &.is-active {
        .menu-icon-Report {
          background-image: url(../assets/img/report_1.png);
        }
        .menu-icon-Monitor {
          background-image: url(../assets/img/wb_1.png);
        }
        .menu-icon-Interview {
          background-image: url(../assets/img/interview_1.png);
        }
        .menu-icon-Config {
          background-image: url(../assets/img/config_1.png);
        }
      }
    }
  }
}
</style>
