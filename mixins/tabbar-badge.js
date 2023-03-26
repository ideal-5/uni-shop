// 购物车徽标的混入
import {
  mapGetters
} from 'vuex'
export default {
  computed: {
    ...mapGetters('m_cart', ['total']) //购物车徽标
  },
  onShow() {
    this.setBadge()
  },
  watch: {
    total() { //监听混入的商品总数量 及时更新tabbar购物车的徽标
      this.setBadge()
    }
  },
  methods: {
    setBadge() {
      uni.setTabBarBadge({ // 设置tabbar徽标api
        index: 2, // tabbar索引
        text: this.total + '' // 徽标内容 只能是字符串 所以加了空字符串
      })
    }
  }
}
