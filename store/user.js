// 收货人信息仓库
export default {
  namespaced: true, // 命名空间

  state: () => ({
    address: JSON.parse(uni.getStorageSync('address') || '{}'), // 用户地址
    token: uni.getStorageSync('token') || '',
    userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}'), // 登录的用户信息
    redirectInfo: null // 重定向的对象
  }),

  mutations: {
    // 存储收货信息(地址)
    updataAddress(state, address) {
      if (address) {
        state.address = address
        this.commit('m_user/saveAddressToStorage')
      }
    },
    // 存储用户登录的信息
    updateUserInfo(state, userinfo) {
      state.userinfo = userinfo
      this.commit('m_user/saveUserInfoToStorage')
    },
    // 存储接口返回的token
    updateToken(state, token) {
      state.token = token
      this.commit('m_user/saveTokenToStorage')
    },
    updateRedirectInfo(state, info) { // 存储页面重定向信息
      state.redirectInfo = info
    },
    // 持久化存储token
    saveTokenToStorage(state) {
      uni.setStorageSync('token', state.token) // 存储到本地 传过来的token就是字符串 不用转换
    },
    // 持久化存储用户地址
    saveAddressToStorage(state) {
      uni.setStorageSync('address', JSON.stringify(state.address)) // 存储到本地
    },
    // 持久化存储用户登录信息
    saveUserInfoToStorage(state) {
      uni.setStorageSync('userinfo', JSON.stringify(state.userinfo)) // 存储到本地
    }
  },
  getters: {
    // 对商品的地址进行拼接 谁用谁调
    addstr(state) {
      if (!state.address.provinceName) return ''
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    }
  },
}
