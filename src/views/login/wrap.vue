<template>
  <div class="login">
    <div class="login-container">
      <div class="login-container-bg">
        <img src="../../assets/login/login-back2.png" />
      </div>
      <div class="login-form">
        <slot></slot>
      </div>
    </div>
    <!-- <div class="login-mask"></div> -->
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'LoginWarp',
  components: {},
  setup() {
    const store = useStore()

    const lang = computed(() => {
      return store.state.app.lang
    })

    return {
      lang,
    }
  },
}
</script>

<style lang="scss">
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background: $bg;
  overflow: hidden;
  .login-bg-img-left {
    position: absolute;
    left: 0;
    top: 0;
    width: 601px;
    height: 100%;
  }
  .login-bg-img-right {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 521px;
  }
  .login-mask {
    position: absolute;
    top: 59%;
    height: 200px;
    width: 600px;
    background-color: rgba(#030a19, 0.37);
    filter: blur(27px);
    z-index: 1;
  }
  .login-container {
    position: absolute;
    z-index: 2;
    display: flex;
    height: 578px;
    width: 812px;
    background-color: white;
    display: flex;
    align-items: center;
    border-radius: 12px;
    .login-container-bg {
      font-size: 0;
      width: 409px;
      text-align: center;
      img {
        border-radius: 12px 0 0 12px;
        width: 321px;
        height: auto;
      }
    }
    .lang-container {
      position: absolute;
      top: 20px;
      right: 10px;
      .lang-wrapper {
        display: flex;
        align-items: center;
        margin-right: 10px;
        cursor: pointer;
        .lang-name {
          margin-right: 8px;
          font-weight: bold;
        }
      }
    }
  }
  .login-form {
    flex-grow: 1;
    padding: 0 68px;
    border-radius: 0 12px 12px 0;
    background: white;
    overflow: hidden;
  }
}
</style>
