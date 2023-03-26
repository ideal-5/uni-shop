<template>
  <view>
    <!-- 自定义搜索框组件 -->
    <view class="search-box">
      <my-search @click="goSearch"></my-search>
    </view>
    <!-- 轮播图 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item,index) in swiperList" :key="index">
        <navigator class="swiper-item" :url="'/subpkg/goods_detall/goods_detall?goods_id='+item.goods_id">
          <image :src="item.image_src" mode=""></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 分类导航 -->
    <view class="nav-list">
      <view class="nav-item" v-for="(item,index) in navList" :key="index" @click="navClickHandler(item.name)">
        <image :src="item.image_src" mode=""></image>
      </view>
    </view>
    <!-- 楼层 -->
    <view class="floor-list">
      <view class="floor-item" v-for="(item,index) in floorList" :key="index">
        <!-- 楼层标题图片 -->
        <image :src="item.floor_title.image_src" class="floor-title"></image>
        <!-- 楼层图片 -->
        <view class="floor-img-box">
          <!-- 左侧的一个大盒子 -->
          <navigator class="left-img-box" :url="item.product_list[0].url">
            <image :src="item.product_list[0].image_src" mode="widthFix"
              :style="{width:item.product_list[0].image_width + 'rpx'}">
            </image>
          </navigator>
          <!-- 右侧的4个小盒子 -->
          <view class="right-img-box">
            <navigator :url="item2.url" class="right-img-item" v-for="(item2,index2) in item.product_list" :key="index2"
              v-if="index2 !== 0">
              <image :src="item2.image_src" mode="widthFix" :style="{width:item2.image_width + 'rpx'}"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js'
  export default {
    mixins: [badgeMix], // 使用上面导入的控制购物车徽标的混入
    data() {
      return {
        // 轮播图数据
        swiperList: [],
        // 分类导航的数据
        navList: [],
        floorList: []
      };
    },
    onLoad() {
      this.getSwiperList() // 调用获取轮播图数据的方法
      this.getNavList() // 调用获取分类导航的方法
      this.getFloorList() // 获取楼层数据
    },
    methods: {
      goSearch() {
        uni.navigateTo({
          url: "/subpkg/search/search"
        })
      },
      // 获取轮播图
      async getSwiperList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/swiperdata')
        if (res.meta.status !== 200) return uni.$showMsg('轮播图获取失败')
        this.swiperList = res.message
      },
      // 获取分类导航
      async getNavList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/catitems')
        if (res.meta.status !== 200) return uni.$showMsg('分类导航获取失败')
        this.navList = res.message
      },
      // 点击分类导航事件
      navClickHandler(name) {
        if (name == '分类') {
          uni.switchTab({
            url: '/pages/cate/cate'
          })
        }
      },
      // 获取楼层数据
      async getFloorList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/floordata')
        if (res.meta.status !== 200) return uni.$showMsg('楼层获取失败')
        res.message.forEach(floor => {
          floor.product_list.forEach(prod => {
            prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
          })
        })
        this.floorList = res.message
      }
    }
  }
</script>

<style lang="scss">
  swiper {
    height: 330rpx;

    .swiper-item,
    image {
      width: 100%;
      height: 100%;
    }
  }

  .nav-list {
    display: flex;
    justify-content: space-around;
    margin: 30rpx 0;

    image {
      width: 128rpx;
      height: 140rpx;
    }
  }

  .floor-title {
    height: 60rpx;
    width: 100%;
  }

  .right-img-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .floor-img-box {
    display: flex;
    padding-left: 10rpx;
  }

  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
  }
</style>
