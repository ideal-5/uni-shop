<!-- my页面的信息组件 -->
<template>
  <view class="my-userinfo-container">
    <!-- 头像和名称区域 -->
    <view class="top-box">
      <image :src="userinfo.avatarUrl" class="avater"></image>
      <view class="nickname">{{userinfo.nickName}}</view>
    </view>
    <!-- 面板区域 -->
    <view class="paner-list">
      <!-- 第一个面板 -->
      <view class="panel">
        <view class="panel-body">
          <view class="panel-item">
            <text>8</text>
            <text>收藏的店铺</text>
          </view>
          <view class="panel-item">
            <text>5</text>
            <text>收藏的商品</text>
          </view>
          <view class="panel-item">
            <text>15</text>
            <text>关注的商品</text>
          </view>
          <view class="panel-item">
            <text>65</text>
            <text>足迹</text>
          </view>
        </view>
      </view>
      <!-- 第二个面板 -->
      <view class="panel">
        <view class="panel-title">
          我的订单
        </view>
        <view class="panel-body">
          <view class="panel-item">
            <image src="/static/my-icons/icon1.png" class="icon"></image>
            <text>待付款</text>
          </view>
          <view class="panel-item">
            <image src="/static/my-icons/icon2.png" class="icon"></image>
            <text>待收货</text>
          </view>
          <view class="panel-item">
            <image src="/static/my-icons/icon3.png" class="icon"></image>
            <text>退款/退货</text>
          </view>
          <view class="panel-item">
            <image src="/static/my-icons/icon4.png" class="icon"></image>
            <text>全部订单</text>
          </view>
        </view>
      </view>
      <!-- 第三个面板 -->
      <view class="panel">
        <view class="panel-list-item">
          <text>收货地址</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
        <view class="panel-list-item">
          <text>联系客服</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
        <view class="panel-list-item" @click="logout">
          <text>退出登录</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    mapState,
    mapMutations
  } from 'vuex'
  export default {
    name: "my-userinfo",
    computed: {
      ...mapState('m_user', ['userinfo'])
    },
    data() {
      return {

      };
    },
    methods: {
      ...mapMutations('m_user', ['updataAddress', 'updateUserInfo', 'updateToken']),
      async logout() { // 点击了退出登录
        const [err, res] = await uni.showModal({
          title: '提示',
          content: '确认退出登录嘛？\n 信息地址也会消失哦',
        }).catch(err => err)
        if (res && res.confirm) { // 点击了确认
          this.updataAddress({}) // 清空地址
          this.updateUserInfo({}) // 清空信息
          this.updateToken('') // 清空token
        }
      }
    }
  }
</script>

<style lang="scss">
  .my-userinfo-container {
    height: 100%;
    background-color: #f4f4f4;

    .top-box {
      height: 400rpx;
      background-color: #c00000;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .avater {
        width: 90px;
        height: 90px;
        border-radius: 45px;
        border: 2px solid #fff;
        box-shadow: 0 1px 5px black;
      }

      .nickname {
        font-size: 16px;
        color: #fff;
        font-weight: bold;
        margin-top: 10px;
      }
    }

    .paner-list {
      padding: 0 10px;
      position: relative;
      top: -10px;

      .panel {
        background-color: #fff;
        border-radius: 3px;
        margin-bottom: 8px;

        .panel-title {
          line-height: 45px;
          padding-left: 10px;
          font-size: 15px;
          border-bottom: 1px solid #f4f4f4;
        }

        .panel-body {
          display: flex;
          justify-content: space-around;



          .panel-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
            padding: 10px 0;
            font-size: 13px;

            .icon {
              width: 35px;
              height: 35px;
            }
          }
        }
      }
    }
  }

  .panel-list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    padding: 0 10px;
    line-height: 45px;
  }
</style>
