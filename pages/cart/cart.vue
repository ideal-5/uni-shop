<!-- 购物车页面 -->
<template>
  <!-- 购物车有商品的展示 -->
  <view class="cart-container" v-if="cart.length !== 0">
    <!-- 收获地址组件 -->
    <my-address></my-address>
    <!-- 商品列表的标题 -->
    <view class="cart-title">
      <!-- 左侧图标 -->
      <uni-icons type="shop-filled" size="18"></uni-icons>
      <!-- 右侧文本 -->
      <text class="cart-title-text">购物车</text>
    </view>

    <!-- 商品列表 -->
    <uni-swipe-action>
      <block v-for="(item,i) in cart" :key="item.goods_id">
        <uni-swipe-action-item :right-options="options" @click="swipeItemClickHandle(item)">
          <my-goods :item="item" :showRadio="true" :showNum="true" @radio-change="radioChangeHandler"
            @num-change="numberChangeHandler"></my-goods>
        </uni-swipe-action-item>
      </block>
    </uni-swipe-action>

    <!-- 自定义结算组件 -->
    <my-settle></my-settle>
  </view>

  <!-- 购物车空白展示的区域 -->
  <view class="empty-cart" v-else>
    <image src="../../static/cart_empty@2x.png" style="border-radius: 50%; width: 150px; height: 150px;"
      class="empty-img"></image>
    <text class="tip-text">快去挑点东西吧~~</text>
  </view>
</template>

<script>
  import {
    mapState,
    mapMutations
  } from 'vuex'
  import badgeMix from '@/mixins/tabbar-badge.js'
  export default {
    mixins: [badgeMix],
    data() {
      return {
        options: [{
          text: '删除',
          style: {
            backgroundColor: '#c00000'
          }
        }]
      };
    },
    computed: {
      ...mapState('m_cart', ['cart'])
    },
    methods: {
      ...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
      radioChangeHandler(e) {
        this.updateGoodsState(e)
      },
      // 数量加减框发生改变
      numberChangeHandler(e) {
        this.updateGoodsCount(e)
      },
      // 右滑点击删除
      swipeItemClickHandle(item) {
        this.removeGoodsById(item.goods_id)
      },
    }
  }
</script>

<style lang="scss">
  .cart-title {
    height: 40px;
    display: flex;
    align-items: center;
    padding-left: 5px;
    border-bottom: 1px solid #efefef;

    .cart-title-text {
      font-size: 14px;
      margin-left: 10px;
    }
  }

  .cart-container {
    padding-bottom: 50px;
  }

  .empty-cart {
    display: flex;
    flex-direction: column;
    padding-top: 150px;
    align-items: center;

    .empty-img {}

    .tip-text {
      font-size: 20px;
      color: gray;
      margin-top: 15px;
    }
  }
</style>
