<template>
  <div class="update-pass-container login-common-style">
    <login-wrap>
      <el-form ref="form" :model="form" class="form-container" :rules="rules">
        <div class="form-container">
          <div class="step1">
            <div class="input-content">
              <!-- <p class="login-form-label">新密码</p> -->
              <el-form-item prop="newPassword">
                <el-input
                  v-model="form.newPassword"
                  placeholder="请输入新密码"
                  class="form-item"
                  type="password"
                ></el-input>
              </el-form-item>
            </div>
            <div class="input-content">
              <!-- <p class="login-form-label">确认密码</p> -->
              <el-form-item prop="confirmPassword">
                <el-input
                  v-model="form.confirmPassword"
                  placeholder="请确认密码"
                  class="form-item"
                  type="password"
                  @keyup.enter="updatePasswod"
                ></el-input>
              </el-form-item>
            </div>
            <div class="captcha">
              <el-form-item class="captchaInput" prop="captchaCode">
                <el-input
                  :style="{ width: 'calc(100% - 100px - 12px)' }"
                  v-model="form.captchaCode"
                  placeholder="请输入验证码"
                  class="form-item"
                  @keyup.enter="updatePasswod"
                ></el-input>
              </el-form-item>
              <img v-if="captchaSrc" @click="getCaptcha" class="captchaImg" :src="captchaSrc" alt="">
            </div>
            <p class="tips">提示：新密码需包含字母/数字/特殊字符组成，长度8～15位</p>
            <div class="btn-container">
              <el-button type="primary" class="button" @click="updatePasswod">提交</el-button>
            </div>
          </div>
        </div>
      </el-form>
    </login-wrap>
  </div>
</template>

<script>
// import { UPDATE_PASSWORD } from '@/common/urlPaths'
// import { rsaEncrypt } from '@/common/utils'
// import loginLogo from '@/assets/login/login-logo-langfang.png'
// import updatePassEmailImg from '@/assets/login/update-pass-email.svg'
// import updatePassPassImg from '@/assets/login/update-password.svg'
// import updatePassConfirmPassImg from '@/assets/login/update-pass-confirm.png'
// import updatePassSuccessImg from '@/assets/login/update-pass-success.png'
import LoginWrap from './wrap.vue'
import UserApi from '@/api/user'
// import md5 from 'js-md5'

export default {
  name: 'UpdatePassword',
  components: {
    LoginWrap
  },
  data() {
    return {
      // loginLogo,
      // updatePassEmailImg,
      // updatePassPassImg,
      // updatePassConfirmPassImg,
      // updatePassSuccessImg,
      passToken: '',
      // tenantCode: '',
      form: {
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        newPassword: [
          {
            required: true,
            message: '请输入新密码',
            trigger: ['blur', 'change']
          }
        ],
        confirmPassword: [
          {
            required: true,
            message: '请输入确认密码',
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
      captchaId: undefined,
      captchaSrc: undefined,
    }
  },
  created() {
    // if (this.$route.query) {
    //   if (this.$route.query.token) {
    //     this.passToken = this.$route.query.token
    //   }
    //   // if (this.$route.query.tenantCode) {
    //   //   this.tenantCode = this.$route.query.tenantCode
    //   // }
    // }
    this.getCaptcha()
  },
  methods: {
    async updatePasswod() {
      const dataForm = this.form
      if (!dataForm.newPassword) {
        return
      }
      if (!dataForm.confirmPassword) {
        return
      }
      // 新密码是否符合规则
      if (!/(?!^(\d+|[a-zA-Z]+|[!@#$%^&*()_+,.-]+)$)^[\w!@#$%^&*()_+,.-]{8,15}$/.test(dataForm.newPassword)) {
        this.$message.error('密码需包含字母、数字、特殊字符三种类型中的两类，字母大小写均可，且长度需8~15位')
        return
      }
      // if (!dataForm.confirmPassword) {
      //   this.errorTipIdx = 2
      //   return
      // }
      if (dataForm.newPassword !== dataForm.confirmPassword) {
        this.$message.error('两次密码不一致')
        return
      }
      const params = {
        token: this.passToken,
        passWord: dataForm.newPassword,
        passWordSt: dataForm.newPassword,
        captchaCode: dataForm.captchaCode,
        captchaId: this.captchaId,
        guid: this.$route.query.guid,
        user: this.$route.query.user,
      }
      const data = await UserApi.updatePassword(params)
      if (!data) return
      this.$message({
        message: '修改密码成功，请重新登录，3秒后自动跳转登录页',
        type: 'success'
      })
      setTimeout(() => {
        this.$router.push({ name: 'Login' })
      }, 3000)
    },
    async getCaptcha() {
      const data = await UserApi.getCaptcha()
      if (!data) return
      this.captchaId = data.captchaId
      this.captchaSrc = data.image
    },
  }
}
</script>

<style scoped lang="scss">
.update-pass-container {
  min-height: 100%;
  .login-form {
    .form-container {
      margin-top: 24px;
      .step1 {
        .input-content {
          margin-bottom: 14px;
          &:last-child {
            margin-bottom: 0;
          }
        }
        .tips {
          margin-top: 12px;
          width: 267px;
          color: #a1b0bf;
          font-size: 12px;
          line-height: 18px;
        }
        .button {
          margin-top: 40px;
          width: 100%;
          height: 42px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
@import './login.scss';
.update-pass-container {
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
