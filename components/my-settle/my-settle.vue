<template>
  <view class="my-settle-container">
    <!-- 全选 -->
    <view class="radio" @click="changeAllState">
      <radio :checked='isFullCheck' color="#c00000"></radio>
      <text>全选</text>
    </view>
    <!-- 合计 -->
    <view class="amount-box">
      合计:<text class="amount">{{checkedGoodsAmount}}</text>
    </view>
    <!-- 结算按钮 -->
    <view class="my-settle-button">
      结算({{checkedCount}})
    </view>

  </view>
</template>

<script>
  import {
    mapGetters,
    mapMutations
  } from 'vuex'
  export default {
    name: "my-settle",
    computed: {
      ...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
      // 判断是否全选
      isFullCheck() {
        return this.checkedCount === this.total
      }
    },
    data() {
      return {

      };
    },
    methods: {
      ...mapMutations('m_cart', ['updateAllGoodsState']),

      // 点击全选框
      changeAllState() {
        // 将当前全选框的状态取反  传给改变所有商品选中状态的函数
        this.updateAllGoodsState(!this.isFullCheck)
      }
    }
  }
</script>

<style lang="scss">
  .my-settle-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    padding-left: 5px;

    .radio {
      display: flex;
      align-items: center;
    }

    .amount-box {
      .amount {
        color: #c00000;
        font-weight: bold;
      }
    }

    .my-settle-button {
      line-height: 50px;
      text-align: center;
      padding: 0 10px;
      height: 100%;
      min-width: 100px;
      background-color: #c00000;
      color: #fff;
    }
  }
</style>
