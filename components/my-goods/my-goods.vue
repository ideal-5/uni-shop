<!-- 商品列表  接收参数：
1.item商品详细：goods_id // id
               goods_name // 名称
               goods_price // 价格
               goods_count // 数量（不计算价钱可以忽略）
               goods_small_logo:  //图片
               goods_state: true // 选中状态
2.showRadio 布尔值 是否展示选中框 默认不展示
3.@radio-change点击选中框事件 事件参数：goods_id,goods_state(选中框状态)
4.showNum布尔值 是否展示数量加减 默认不展示
5.@num-change 数量框改变事件 事件参数：goods_id,goods_count(选中框状态)
-->
<template>
  <view>
    <view class="goods-item">

      <!-- 左侧 -->
      <view class="goods-item-left">
        <radio :checked="item.goods_state" color="#c00000" v-if="showRadio" @click="radioClickHandler"></radio>
        <image :src="item.goods_small_logo || defaultPic" class="goods-pic"></image>
      </view>

      <!-- 右侧 -->
      <view class="goods-item-right">
        <view class="goods-name">{{item.goods_name}}</view>
        <view class="goods-info-box">
          <view class="goods-price">￥{{item.goods_price | tofixed}}</view>
          <uni-number-box :min="1" :value="item.goods_count" v-if="showNum" @change="numberChangeHandler">
          </uni-number-box>
        </view>
      </view>

    </view>
  </view>
</template>

<script>
  export default {
    name: "my-goods",
    props: {
      item: { // 商品数据
        type: Object,
        default: {}
      },
      showRadio: {
        type: Boolean,
        default: false // 默认不展示radio选择框
      },
      showNum: {
        type: Boolean,
        default: false // 默认不展示数量加减
      }
    },
    // 过滤器
    filters: {
      tofixed(num) {
        return Number(num).toFixed(2) // Number() 转为数字， .toFixed(2) 保留2位小数
      }
    },
    data() {
      return {
        // 商品图片失效用的默认图片
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
      };
    },
    methods: {
      radioClickHandler() { // 选择框被点击
        this.$emit('radio-change', {
          goods_id: this.item.goods_id,
          goods_state: !this.item.goods_state,
        })
      },
      numberChangeHandler(newValue) { // 数量框改变
        this.$emit('num-change', {
          goods_id: this.item.goods_id,
          goods_count: newValue - 0
        })
      }
    }
  }
</script>

<style lang="scss">
  .goods-item {
    width: 750rpx;
    box-sizing: border-box;
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #f0f0f0;

    .goods-item-left {
      margin-right: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .goods-pic {
        width: 100px;
        height: 100px;
        display: block; //转为块级元素

      }
    }

    .goods-item-right {
      display: flex;
      flex: 1;
      flex-direction: column; // y轴为主轴
      justify-content: space-between; // 贴边对齐

      .goods-name {
        font-size: 13px;
      }

      .goods-info-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: 5px;

        .goods-price {
          color: #c00000;
          font-size: 16px;
        }
      }
    }
  }
</style>
