import App from './App'
import Vue from 'vue'
import store from '@/store/store.js'
// 导入网络请求的包
import {
  $http
} from '@escook/request-miniprogram'
uni.$http = $http

// 配置请求根路径
// $http.baseUrl = 'https://www.uinav.com'
$http.baseUrl = 'https://api-hmugo-web.itheima.net'
// 请求开始之前做一些事情
$http.beforeRequest = function(options) {
  uni.showLoading({ // 展示loading
    title: '数据加载中...'
  })
  // 判断当前请求的接口是否已登录 登录接口都包含/my/  如果已登录把token添加到请求头中
  if (options.url.indexOf('/my/') !== -1) {
    options.header = {
      Authorization: store.state.m_user.token
    }
  }
}
// 请求完成之后做一些事情
$http.afterRequest = function() {
  uni.hideLoading() // 取消loading
}
// 封装弹窗的方法
uni.$showMsg = function(title = '数据请求失败', duration = 1500) {
  uni.showToast({ // 展示loading
    title,
    duration,
    icon: 'none'
  })
}


Vue.config.productionTip = false
App.mpType = 'app'



const app = new Vue({
  ...App,
  store
})
app.$mount()
