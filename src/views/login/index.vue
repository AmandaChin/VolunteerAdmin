<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm" ref="loginForm" label-position="left" >
      <div class="title-container">
        <h3 class="title">欢迎来到时间银行管理员界面</h3>
        <!--<lang-select class="set-language"></lang-select>-->
      </div>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="username" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="password" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>

      <el-button type="primary" style="width:100%;margin-bottom:20px;" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>

      <!-- <el-button type="primary" style="width:100%;margin-bottom:30px;margin-left:0" @click="register">还没账号？快去注册</el-button> -->

    </el-form>

    <el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog" append-to-body>
      {{$t('login.thirdpartyTips')}}
      <br/>
      <br/>
      <br/>
      <social-sign />
    </el-dialog>

  </div>
</template>

<script>
import Vue from 'vue'
import { Message } from 'element-ui'
import SocialSign from './socialsignin'
import axios from 'axios'
import port from '../../utils/manage'
import global from '../../utils/global_userID'

export default {
  components: { SocialSign },
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      // if (!isvalidUsername(value)) {
      //   callback(new Error('Please enter the correct user name'))
      // } else {
      //    callback()
      // }
      return callback()
    }
    const validatePassword = (rule, value, callback) => {
      // if (value.length < 6) {
      //   callback(new Error('The password can not be less than 6 digits'))
      // } else {
      //   callback()
      // }
      return callback()
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginForm2:{
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin: function() {
      var num = -1
      var params = new URLSearchParams()
      params.append('Account', this.loginForm.username)
      params.append('Password', this.loginForm.password)

      var params_ID = new URLSearchParams()
      params_ID.append('Account', this.loginForm.username)
      axios.post('http://' + port.info.host + ':' + port.info.port + '/api/getUserIDbyAccount', params_ID).then(
      // axios.post('http://localhost:3000/api/getUserIDbyAccount', params_ID).then(
        (res) => {
          global.global_userID = res.data.UserID
          //this.$store.dispatch('StoreID',res.data.UserID)
          localStorage.setItem('adminid', JSON.stringify(res.data.UserID));
          console.log(res)
        }
      ).catch((err) => {
        console.log(err)
      })

      const theRefs = this.$refs
      const theStore = this.$store
      const theRouter = this.$router
      const theLoginForm = this.loginForm2
      const message = this.$message

      axios.post('http://' + port.info.host + ':' + port.info.port + '/api/allUserLogin', params)
      // axios.post('http://localhost:3000/api/allUserLogin', params)
        .then(function(res) {
          num = res.data.num
          console.log('登录返回值：' + num)

          theRefs.loginForm.validate(valid => {
            if (valid) {
              //theLoginForm.username = 'admin'
               // theLoginForm.password = '1111111'
              if (num === -1) {
                Message('用户名或密码错误')
              }else if(num === 0){
                theLoginForm.username = 'Superadmin'
                theLoginForm.password = '1111111'
              }else if(num === 1){
                theLoginForm.username = 'Aadmin'
                theLoginForm.password = '1111111'
              }else if(num === 2){
                theLoginForm.username = 'Badmin'
                theLoginForm.password = '1111111'
              }else if(num === 3){
                Message('普通用户不可以登录哦')
              }
              console.log(theLoginForm)
              theStore.dispatch('LoginByUsername', theLoginForm).then(() => {
                 theRouter.push({ path: '/homepage' })
                 location.reload()
              }).catch(() => {
                // this.$error('提交格式错误');
                //Message('提交格式错误')
              })
            } else {
              console.log('error submit!!')
              this.$error('提交格式错误')
              return false
            }
          })
        }).catch(function(err) {
          console.log('login error' + err)
          Message('网络异常')
        })
    },

    register: function() {
      // this.loginForm.username='admin';
      // this.loginForm.password='123456';

      // const theRefs = this.$refs
      // const theStore = this.$store
      // const theRouter = this.$router
      // const theLoginForm = this.loginForm

      // theRefs.loginForm.validate(valid => {
      //   if (valid) {
      //     theStore.dispatch('LoginByUsername', theLoginForm).then(() => {
      //       theRouter.push({ name: 'register' })
      //     }).catch(() => {
      //       this.$error('提交格式错误')
      //     })
      //   } else {
      //     console.log('error submit!!')
      //     this.$error('提交格式错误')
      //     return false
      //   }
      // })
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1)
      // const hashObj = getQueryObject(hash)
      // const originUrl = window.location.origin
      // history.replaceState({}, '', originUrl)
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // }
      // const codeName = hashObj[codeMap[this.auth_type]]
      // if (!codeName) {
      //   alert('第三方登录失败')
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' })
      //   })
      // }
    }
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>
