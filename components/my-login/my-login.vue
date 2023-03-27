<!-- my页面的登录组件 -->
<template>
  <view class="login-container">
    <uni-icons type="contact-filled" size="100" color="#a7a7a7"></uni-icons>
    <!-- <button class="btn-login" type="primary" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button> -->
    <button class="btn-login" type="primary" @click="getUserInfo">一键登录</button>
    <text class="tips-text">登录后尽享更多权益</text>
  </view>
</template>

<script>
  import {
    mapMutations,
    mapState
  } from 'vuex'
  export default {
    name: "my-login",
    data() {
      return {

      };
    },
    computed: {
      ...mapState('m_user', ['redirectInfo'])
    },
    methods: {
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),

      // 用户授权之后 获取用户的基本信息
      getUserInfo(e) {
        uni.getUserProfile({
          desc: '121',
          // 授权成功
          success: res => { // 获取了用户头像昵称等
            this.updateUserInfo(res.userInfo) // 存储vuex
            this.getToken(res) // 调用获取code的api 并整理参数发起登录请求
          },
          // 授权失败
          fail: res => uni.$showMsg('您取消了登录授权')
        })
      },
      getToken(info) { //获取code并整理参数发起登录请求
        // 获取code的值
        uni.login({
          success: async res => {
            const query = {
              code: res.code, // 登录凭证uni.login 获得
              // 下面4个参数都是 uni.getUserProfile 获取微信权限获得 已经作为参数传过来了
              encryptedData: info.encryptedData, // 用户信息密文
              iv: info.iv, // 加密算法的初始向量
              rawData: JSON.stringify(info.rawData), //用户信息原始数据字符串
              signature: info.signature, //使用 sha1得到字符串
            }
            const {
              data: loginResult
            } = await uni.$http.post('/api/public/v1/users/wxlogin', query) // 登录接口
            // 因为调用不了登录接口 所以返回的状态码是400
            if (loginResult.meta.status !== 400) return uni.$showMsg('登陆失败!')
            const falseToken = this.generateToken(32) // 生成假token
            this.updateToken(falseToken)
            // this.updateToken(  // 文档里面的token也用不了了  
            //   'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEyLCJpYXQiOjE1MjU0MDIyMjMsImV4cCI6MTUyNTQ4ODYyM30.g-4GtEQNPwT_Xs0Pq7Lrco_9DfHQQsBiOKZerkO-O-o'
            // )
            this.navigateBack() // 登录成功后调用根据重定向跳转页面的函数
          },
          fail: err => {
            uni.showMsg('登录失败!')
          }
        })
      },
      // 根据重定向跳转页面并 重置重定向
      navigateBack() {
        if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          uni.switchTab({
            url: this.redirectInfo.from,
            complete: () => { // complete api成功失败都会被调用
              this.updateRedirectInfo(null) // 重定向重置为null
            }
          })
        }
      },
      // 生成随机token的函数
      generateToken(length) {
        // 定义字符集合，包含数字和大小写字母
        const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let token = '';
        // 生成指定长度的随机token
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          token += characters[randomIndex];
        }
        return token;
      }
    }
  }
</script>

<style lang="scss">
  .login-container {
    height: 750rpx;
    background-color: #f8f8f8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;

    &::after {
      content: ' ';
      display: block;
      width: 100%;
      height: 40px;
      background-color: #fff;
      position: absolute;
      bottom: 0;
      left: 0;
      border-radius: 100%;
      transform: translateY(50%);
    }

    .contact-filled {}

    .btn-login {
      width: 90%;
      border-radius: 100px;
      margin: 15px 0;
      background-color: #c00000;
    }

    .tips-text {
      font-size: 12px;
      color: gray;
    }
  }
</style>
