<template>
  <view v-if="goods_info.goods_name" class="goods">
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="700" :circular="true">
      <swiper-item v-for="(item,i) in goods_info.pics" :key="i">
        <image :src="item.pics_big" @click="preview(i)"></image>
      </swiper-item>
    </swiper>

    <!-- 商品信息区域 -->
    <view class="goods-info-box">
      <!-- 价格（第一行） -->
      <view class="price">${{goods_info.goods_price}}</view>

      <!-- 第二行（名称 和 收藏） -->
      <view class="goods-info-body">
        <!-- 左（名称） -->
        <view class="goods-info-name">{{goods_info.goods_name}}</view>
        <!-- 右（收藏 和 文字） -->
        <view class="goods-info-icons">
          <uni-icons :type="infoStar" size="30" @click="changeIcons" color="#c00000"></uni-icons>
          <text class="goods-info-icons-text">收藏</text>
        </view>
      </view>

      <!-- 第三行（快递） -->
      <view class="goods-info-yf">快递：免运费</view>

    </view>

    <!-- 后端返回的结构 -->
    <rich-text :nodes="goods_info.goods_introduce"></rich-text>

    <!-- 商品导航组件 -->
    <view class="goods-nav">
      <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick"
        @buttonClick="buttonClick" />
    </view>
    <!-- 返回顶部组价 -->
    <zero-back-top :scrollTop='scrollTop' :top="1500" iconType="arrow" :iconSize="90" :bottom="150" color="#fff"
      backgroundColor="#c00000">
    </zero-back-top>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        goods_info: {},
        options: [
          //   {  // 后期想加 可以自己加个客服
          //   icon: 'headphones',
          //   text: '客服'
          // }, 
          {
            icon: 'shop',
            text: '店铺',
            infoBackgroundColor: '#007aff',
            infoColor: "red"
          }, {
            icon: 'cart',
            text: '购物车',
            info: 9
          }
        ],
        buttonGroup: [{
            text: '加入购物车',
            backgroundColor: '#ff0000',
            color: '#fff'
          },
          {
            text: '立即购买',
            backgroundColor: '#ffa200',
            color: '#fff'
          }
        ],
        star: true, // 收藏的icons图标
        scrollTop: 0 // 距离顶部的距离
      };
    },
    computed: { // 计算属性  控制收藏图标的 空心实心
      infoStar() {
        if (this.star) return 'star'
        uni.$showMsg('其实收藏不了')
        return 'star-filled'
      }
    },
    // 页面滚动事件
    onPageScroll(e) {
      this.scrollTop = e.scrollTop; // 获取距离页面顶部的距离 以便展示返回顶部按钮
    },
    // 接收页面参数 并调用接口
    onLoad(options) {
      const goods_id = options.goods_id
      this.getGoodsDetail(goods_id)
    },
    methods: {
      async getGoodsDetail(goods_id) {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/detail', {
          goods_id
        })
        if (res.meta.status !== 200) return uni.$showMsg()

        // 给结构直接返回的结构加一个 style="display:block;"
        res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;"')
          .replace(/webp/g, 'jpg')
        this.goods_info = res.message
      },
      // 点击图片预览
      preview(i) {
        uni.previewImage({
          current: i,
          urls: this.goods_info.pics.map(x => x.pics_big) // map遍历数组返回新数组  x为数组中的每一个元素
        })
      },
      // 点击自定义组件tabbar
      onClick(e) {
        if (e.content.text === '购物车') {
          uni.switchTab({
            url: '/pages/cart/cart'
          })
        }
      },
      changeIcons() {
        this.star = !this.star
      }
    }
  }
</script>

<style lang="scss">
  swiper {
    height: 750rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .goods-info-box {

    padding: 10px;
    padding-right: 0;

    .price {
      color: #c00000;
      font-size: 18px;
      margin: 10px 0;
      font-weight: bold;
    }

    .goods-info-body {
      display: flex;
      justify-content: space-between;

      .goods-info-name {
        font-size: 13px;
        margin-right: 10px;
      }

      .goods-info-icons {
        width: 120px;
        font-size: 12;
        display: flex;
        flex-direction: column;
        align-items: center; // x居中
        justify-content: center; // y居中
        border-left: 2px solid #efefef;
        color: gray;
      }
    }

    .goods-info-yf {
      font-size: 12px;
      color: gray;
      margin: 10px 0;
    }
  }

  .goods-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  .goods {
    padding-bottom: 50px;
  }
</style>
