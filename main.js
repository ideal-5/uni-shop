import App from './App'
import Vue from 'vue'
// 导入网络请求的包
import {
  $http
} from '@escook/request-miniprogram'
uni.$http = $http

// 配置请求根路径
$http.baseUrl = 'https://www.uinav.com'
// 请求开始之前做一些事情
$http.beforeRequest = function(options) {
  uni.showLoading({ // 展示loading
    title: '数据加载中...'
  })
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
  ...App
})
app.$mount()
