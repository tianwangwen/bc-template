<template>
  <div class="header">
    <div class="left">
    </div>
    <div class="right">
      <MessageList></MessageList>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img src="../../assets/img/logo.png" class="user-avatar" />
          <span class="user-name">{{ props.info.realName }}</span>
          <el-icon>
            <el-icon>
              <ArrowDown />
            </el-icon>
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu class="user-dropdown">
            <el-dropdown-item>
              <span style="display: block" @click="logout">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>


<script setup>
import { removeToken, login, clearTabs } from "@/utils/auth";
import { sensorsList } from '@/utils/sensors'
import MessageList from "./message-list.vue";

const props = defineProps({ info: Object });
const logout = () => {
  sensorsList.sfzc_logOut()
  removeToken();
  clearTabs();
  login();
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  background-color: white;
  border-bottom: 1px solid $borderColor;

  .avatar-container {
    .avatar-wrapper {
      display: flex;
      align-items: center;
      margin-right: 24px;
      color: $label;
      cursor: pointer;

      .user-avatar {
        margin-right: 8px;
        width: 24px;
        height: 24px;
        border-radius: 12px;
      }

      .user-name {
        margin-right: 8px;
        font-weight: bold;
      }

      .icon {
        transform: translateY(1px);
        font-size: 12px;
      }
    }
  }
  .right {
    display: flex;
    align-items: center;
  }
}
</style>