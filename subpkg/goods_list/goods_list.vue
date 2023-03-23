<template>
  <view>
    <view class="goods-list">

      <view v-for="(item,i) in goodsList" :key="i" @click="gotoDetail(item)">
        <!-- 自定义组件 -->
        <my-goods :item="item"></my-goods>
      </view>

    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 请求参数
        queryObj: {
          query: '', // 请求关键词
          cid: '', // 请求id
          pagenum: 1, // 第几页
          pagesize: 10 // 每页多少数据
        },

        // 数据
        goodsList: [],
        // 总数据量
        total: 0,
        // 节流阀
        isLoading: false
      };
    },
    onLoad(options) {
      // 优化写法
      // Object.assign(this.queryObj, options)
      // 传统写法
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      // 调用获取数据函数
      this.getGoodsList()
    },
    methods: {
      // 获取商品列表数据
      async getGoodsList(cd) {
        this.isLoading = true // 打开节流阀

        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        if (res.meta.status !== 200) return uni.$showMsg('获取失败')
        this.goodsList = [...this.goodsList, ...res.message.goods]
        this.total = res.message.total
        cd && cd() // 停止下拉刷新的函数
        this.isLoading = false // 关闭节流阀
      },
      gotoDetail(goods) {
        uni.navigateTo({
          url: "/subpkg/goods_detall/goods_detall?goods_id=" + goods.goods_id
        })
      }
    },
    onReachBottom() {
      // 如果每页的数据乘当前页数大于等于总数据  就中断请求
      if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('没数据了')
      if (this.isLoading) return // 如果节流阀存在
      // 上拉触底事件 让页码+1
      this.queryObj.pagenum++
      this.getGoodsList()
    },
    // 下拉刷新
    onPullDownRefresh() {
      // 重置数据
      this.queryObj.pagenum = 1
      this.total = 0
      this.isLoading = false
      this.goodsList = []
      // 重新发请求 并传入关闭下拉刷新的函数
      this.getGoodsList(() => uni.stopPullDownRefresh())
    }
  }
</script>

<style lang="scss">

</style>
