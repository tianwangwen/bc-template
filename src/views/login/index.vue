<template>
  <div class="login login-common-style">
    <login-wrap>
      <el-form ref="form" :model="dataForm" class="form-container" :rules="rules">
        <div class="logoWrap">
          <img :src="logo" width="43" height="32" />
          <span>智借催收系统</span>
        </div>
        <el-form-item prop="userName">
          <el-input v-model="dataForm.userName" placeholder="请输入用户名" class="form-item"></el-input>
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input
            v-model="dataForm.passWord"
            placeholder="请输入密码"
            type="password"
            class="form-item"
            @keyup.enter="handleClickLogin"
          ></el-input>
        </el-form-item>
        <div class="captcha">
          <el-form-item class="captchaInput" prop="captchaCode">
            <el-input
              :style="{ width: 'calc(100% - 100px - 12px)' }"
              v-model="dataForm.captchaCode"
              placeholder="请输入验证码"
              class="form-item"
              @keyup.enter="handleClickLogin"
            ></el-input>
          </el-form-item>
          <img v-if="captchaSrc" @click="getCaptcha" class="captchaImg" :src="captchaSrc" alt="">
        </div>
        <el-form-item style="margin-top: 32px">
          <el-button v-loading="loading" type="primary" class="button" @click="handleClickLogin">登录</el-button>
        </el-form-item>
      </el-form>
      <div class="update-password" @click="goModifyPass">忘记密码</div>
    </login-wrap>
    <el-dialog
      v-model="passOverdue"
      width="300px"
      title="提示"
      :append-to-body="false"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <span>当前密码第一次登录, 请修改密码</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" class="tips-dialog-submit-btn" type="primary" @click="goModifyPass">确 定</el-button>
          <el-button size="small" @click="passOverdue = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, createNamespacedHelpers } from 'vuex'
import loginLogo from '@/assets/login/login-logo-langfang.png'
import logo from '@/assets/small_logo.png'
import LoginWrap from './wrap.vue'
import UserApi from '@/api/user'
const { mapActions: userMapActions } = createNamespacedHelpers('user')

export default {
  name: 'Login',
  components: {
    LoginWrap
  },
  data() {
    return {
      tempToken: '',
      logo,
      loginLogo,
      dataForm: {
        userName: '',
        passWord: '',
        captchaCode: '',
      },
      rules: {
        userName: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['blur', 'change']
          }
        ],
        passWord: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['blur', 'change']
          }
        ],
        captchaCode: [
          {
            required: true,
            message: '请输入验证码',
            trigger: ['blur', 'change']
          }
        ]
      },
      passOverdue: false,
      redirect: undefined,
      captchaId: undefined,
      captchaSrc: undefined,
      loading: false
    }
  },
  computed: mapState({
    user: (state) => state.user
  }),
  created() {
    const { redirect } = this.$route.query
    if (redirect) {
      this.redirect = decodeURIComponent(redirect)
    }
    if (this.user.token) {
      this.$router.push('/')
    } else {
      this.getCaptcha()
    }
  },
  methods: {
    ...userMapActions(['login', 'getInfo']),
    async onLogin() {
      this.loading = true
      const data = await this.login({
        ...this.dataForm,
        captchaId: this.captchaId,
      })
      this.loading = false
      if (!data) {
        this.getCaptcha()
        return
      }
      if (this.user.token) {
        await this.getInfo()
        if (this.user.info.userId) {
          const isRedirect = this.redirect?.indexOf('wa=true') > -1
          this.$router.push(isRedirect ? (this.redirect || '/') : '/')
        }
      }
    },
    async getCaptcha() {
      const data = await UserApi.getCaptcha()
      if (!data) return
      this.captchaId = data.captchaId
      this.captchaSrc = data.image
    },
    async handleClickLogin() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          this.onLogin()
        }
      })
    },
    goModifyPass() {
      this.$router.push({ path: '/forget-password' })
    },
    updatePassword() {
      window.location.href = import.meta.env.VITE_APP_UPDATE_PASSWORD_HREF
    }
  }
}
</script>

<style scoped lang="scss">
.login {
  min-height: 100%;
}
</style>
<style lang="scss">
@import './login.scss';

.login {
  .form-container {
    .logoWrap {
      margin-bottom: 32px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      color: #2e3b57;
      font-size: 16px;
      font-weight: 700;
      font-family: Tensentype-ChaoYuanJ, Tensentype;
      width: 267px;
    }
    .el-form-item {
      margin-bottom: 18px;
    }
    .el-form-item__error {
      position: absolute;
      top: -14px;
      left: 12px;
      background: white;
      line-height: 12px;
      height: 12px;
      padding: 0;
      transform: none;
    }
  }
  .tips-dialog {
    .el-dialog {
      .el-dialog__header {
        display: none;
      }
      .el-dialog__body {
        padding: 30px 0 14px;
        text-align: center;
      }
    }
  }
  .update-password {
    text-align: right;
    color: $blue;
    cursor: pointer;
    font-size: 12px;
  }
  .captcha {
    display: flex;
    .captchaInput {
      overflow: hidden;
      margin-right: 12px;
      margin-bottom: 0;
      .el-input__inner {
        width: calc(267px - 100px - 12px);
      }
    }
    .captchaImg {
      cursor: pointer;
      width: 100px;
      height: 40px;
      flex-shrink: 0;
    }
  }
}
</style>
