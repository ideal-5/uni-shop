export default {
  namespaced: true, // 命名空间

  state: () => ({
    cart: JSON.parse(uni.getStorageSync('cart') || '[]')
  }),

  mutations: {
    // 购物车添加方法
    addToCart(state, goods) {
      //find 查找数组 有符合条件的返回该元素（第一个）  没有返回undefined
      const findResult = state.cart.find(x => x.goods_id == goods.goods_id)
      if (!findResult) {
        state.cart.push(goods)
      } else {
        findResult.goods_count++ // find返回的是一个引用对象 所以直接修改返回值  原数组也改变
      }
      this.commit('m_cart/saveToStorage')
    },
    // 更新购物车商品勾选状态
    updateGoodsState(state, e) {
      const findResult = state.cart.find(x => x.goods_id === e.goods_id)
      if (findResult) {
        findResult.goods_state = e.goods_state
      }
      this.commit('m_cart/saveToStorage')
    },
    // 更新商品数量
    updateGoodsCount(state, e) {
      const findResult = state.cart.find(x => x.goods_id === e.goods_id)
      if (findResult) {
        findResult.goods_count = e.goods_count
      }
      this.commit('m_cart/saveToStorage')
    },
    // 根据goods_id删除商品
    removeGoodsById(state, goods_id) {
      state.cart = state.cart.filter(x => x.goods_id !== goods_id)
      this.commit('m_cart/saveToStorage')
    },
    // 根据接收的参数 改变购物车商品的选中状态
    updateAllGoodsState(state, newState) {
      state.cart.forEach(x => x.goods_state = newState)
      this.commit('m_cart/saveToStorage')
    },
    saveToStorage(state) { // 存储到本地
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    }
  },

  getters: {
    total(state) { // 计算商品总数量
      // let c = 0
      // state.cart.forEach(x => c += x.goods_count)
      // return c
      return state.cart.reduce((total, item) => total += item.goods_count, 0)
    },
    // 计算选中商品总数量
    checkedCount(state) {
      return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
    },
    // 计算选中商品的价格
    checkedGoodsAmount(state) {
      return state.cart.filter(x => x.goods_state).reduce((total, x) => total += (x.goods_count * x.goods_price), 0)
        .toFixed(2)
    }
  },
}
