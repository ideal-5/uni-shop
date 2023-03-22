<template>
  <view>
    <!-- 自定义的搜索组件 -->
    <my-search @click="goSearch"></my-search>
    <view class="scroll-view-container">
      <!-- 左侧 -->
      <scroll-view class="left-scroll-view" scroll-y :style="{height: wh + 'px'}">
        <block v-for="(item,index) in cateList" :key="index">
          <view :class="['left-scroll-view-item',index === active ? 'active' : '']" @click="activeChanged(index)">
            {{item.cat_name}}
          </view>
        </block>
      </scroll-view>
      <!-- 右侧 -->
      <scroll-view class="right-scroll-view" scroll-y :style="{height: wh + 'px'}" :scroll-top="scrollTop">
        <view class="cate-lv2" v-for="(item2,i2) in cateLeve2" :key="i2">
          <!-- 二级分类 -->
          <view class="cate-lv2-title">|{{item2.cat_name}}|</view>
          <!-- 三级分类 -->
          <view class="cate-lv3-list">
            <view class="cate-lv3-item" v-for="(item3,i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
              <!-- 三级分类的图片 -->
              <image :src="item3.cat_icon.replace('dev','web')"></image>
              <!-- 三级分类的文本 -->
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
        </view>



      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 当前设备可用高度
        wh: 0,
        // 分类列表数据
        cateList: [],
        active: 0,
        // 二级分类数据
        cateLeve2: [],
        // 滚动条
        scrollTop: 0
      };
    },
    onLoad() {
      // 获取当前设备可用高度
      const sysInfo = uni.getSystemInfoSync()
      this.wh = sysInfo.windowHeight - 50, // 减去顶部搜索框的高度
        // 调用获取分类列表数据的函数
        this.getCateList()
    },
    methods: {
      goSearch() {
        uni.navigateTo({
          url: '/subpkg/search/search'
        })
      },
      // 获取分类列表数据
      async getCateList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/categories')
        if (res.meta.status !== 200) return uni.$showMsg('获取分类列表失败')
        this.cateList = res.message
        this.cateLeve2 = res.message[0].children
      },
      activeChanged(i) {
        this.active = i
        this.cateLeve2 = this.cateList[i].children
        this.scrollTop = this.scrollTop === 0 ? 1 : 0
      },
      gotoGoodsList(item3) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?cid=' + item3.cat_id
        })
      }
    }
  }
</script>

<style lang="scss">
  .scroll-view-container {
    display: flex;

    .left-scroll-view {
      width: 120px;

      .left-scroll-view-item {
        background-color: #f7f7f7;
        line-height: 60px;
        text-align: center;
        font-size: 12px;

        &.active {
          background-color: #fff;
          position: relative;

          &::before {
            content: ' ';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #c00000;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
          }
        }
      }
    }
  }

  .cate-lv2-title {
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
  }

  .cate-lv3-list {
    display: flex;
    flex-wrap: wrap;

    .cate-lv3-item {
      width: 33.33%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;

      image {
        width: 60px;
        height: 60px;
      }

      text {
        font-size: 12px;
      }
    }
  }
</style>
