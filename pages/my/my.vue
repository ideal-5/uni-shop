<template>
  <view class="my-container">
    <!-- 登录页面 -->
    <my-login v-if="!token"></my-login>
    <!-- 信息页面 -->
    <my-userinfo v-else></my-userinfo>
  </view>
</template>

<script>
  import {
    mapState
  } from 'vuex'
  import badgeMix from '@/mixins/tabbar-badge.js'
  export default {
    mixins: [badgeMix], // 使用上面导入的控制购物车徽标的混入
    computed: {
      ...mapState('m_user', ['token'])
    },
    data() {
      return {

      };
    }
  }
</script>

<style lang="scss">
  page,
  .my-container {
    height: 100%;
  }
</style>
