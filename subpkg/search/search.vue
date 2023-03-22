<template>
  <view>
    <!-- 搜索框跳转的页面 -->
    <view class="search-box">
      <uni-search-bar @input="input" :radius="100" placeholder="请输入搜索内容" cancelButton="none" focus="true">
      </uni-search-bar>
    </view>
    <!-- 搜索建议列表 -->
    <view class="sugg-list">
      <view class="sugg-item" v-for="(item,i) in searchResults" :key="item.goods_id" @click="gotoDetail(item.goods_id)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="right" size="16"></uni-icons>
      </view>

    </view>
    <!-- 搜索历史 -->
    <view class="history-box" v-show="!kw">
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="clean"></uni-icons>
      </view>
      <!-- 列表区域 -->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item,i) in histories" :key="i" @click="gotoGoodsList(item)"></uni-tag>
      </view>

    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        timer: null,
        kw: '', //输入框值
        searchResults: [], //搜索的结果列表
        historyList: [] // 历史记录的结果
      };
    },
    onLoad() {
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
    },
    computed: {
      histories() {
        return [...this.historyList].reverse() // 进行反转
      }
    },
    methods: {
      // input输入事件
      input(e) {
        clearTimeout(this.timer) // 先清除定时器
        this.timer = setTimeout(() => {
          this.kw = e
          this.getSearchResults()
        }, 500)
      },
      async getSearchResults() {
        // 判断搜索值是否为空
        if (this.kw.length === 0) {
          this.searchResults = []
          return
        }
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/qsearch', {
          query: this.kw
        })
        if (res.meta.status !== 200) return
        this.searchResults = res.message
        this.saveSearchHistory()
      },
      // 保存搜索历史记录
      saveSearchHistory() {
        const set = new Set(this.historyList) // set数据不能存储相同的值解决了重复
        set.delete(this.kw) // 添加之前先删除
        set.add(this.kw) // 添加到末尾 (计算属性中进行了翻转)
        this.historyList = Array.from(set) // 转换为数组
        uni.setStorageSync('kw', JSON.stringify(this.historyList))
      },
      clean() {
        this.historyList = []
        uni.setStorageSync('kw', '[]')
      },
      // 点击建议跳转商品详情页
      gotoDetail(res) {
        uni.navigateTo({
          url: "/subpkg/goods_detall/goods_detall?item.goods_id=" + res
        })
      },
      gotoGoodsList(res) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?query=' + res
        })
      }
    }
  }
</script>

<style lang="scss">
  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
  }

  .sugg-list {
    padding: 0 5px;

    .sugg-item {
      display: flex;
      align-items: center; //纵向居中
      justify-content: space-between; // 两边贴边对齐
      font-size: 12px;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;

      .goods-name {
        white-space: nowrap; // 单行显示，不换行
        overflow: hidden; // 超出隐藏，溢出隐藏
        text-overflow: ellipsis; // 超出部分用...代替
      }
    }
  }

  .history-box {
    padding: 0 5px;

    .history-title {
      display: flex;
      justify-content: space-between;
      height: 40px;
      align-items: center;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
    }

    .history-list {
      display: flex;
      flex-wrap: wrap; //允许换行

      uni-tag {
        margin-top: 5px;
        margin-right: 5px;
        margin-bottom: 5px;
      }
    }
  }
</style>
