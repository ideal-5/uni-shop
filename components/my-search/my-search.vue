<template>
  <view class="my-search-container" :style="{'background-color':bgcolor}" @click="portClick">
    <view class="my-search-box" :style="{'border-radius':radius + 'px'}">
      <!-- 使用官方uni-ui提供 的图标组件 -->
      <uni-icons type="search" size="17"></uni-icons>
      <text class="placeholder">{{text}}</text>
    </view>
  </view>
</template>

<script>
  export default {
    name: "my-search",
    props: {
      // 背景颜色
      bgcolor: {
        type: String,
        default: '#c00000' // 默认值
      },
      // 圆角尺寸
      radius: {
        type: Number,
        default: 18 // px
      },
      text: {
        type: String,
        default: '搜索'
      }
    },
    data() {
      return {

      };
    },
    methods: {
      portClick() {
        this.$emit('click')
      }
    }
  }
</script>

<style lang="scss">
  .my-search-container {
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 10px;

    .my-search-box {
      height: 36px;
      width: 100%;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;

      .placeholder {
        font-size: 15px;
        margin-left: 5px;
      }
    }
  }
</style>
