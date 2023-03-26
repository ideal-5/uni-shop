// 收货人信息仓库
export default {
  namespaced: true, // 命名空间
  state: () => ({
    address: JSON.parse(uni.getStorageSync('address') || '{}')
  }),
  mutations: {
    // 存储收货信息
    updataAddress(state, address) {
      if (address) {
        state.address = address
        this.commit('m_user/saveAddressToStorage')
      }
    },
    // 持久化存储
    saveAddressToStorage(state) {
      uni.setStorageSync('address', JSON.stringify(state.address)) // 存储到本地
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
