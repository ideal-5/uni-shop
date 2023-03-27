<!-- 购物车页面底部结算栏 -->
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
    <view class="my-settle-button" @click="settlement">
      结算({{checkedCount}})
    </view>

  </view>
</template>

<script>
  import {
    mapGetters,
    mapMutations,
    mapState
  } from 'vuex'
  export default {
    name: "my-settle",
    computed: {
      ...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
      ...mapGetters('m_user', ['addstr']),
      ...mapState('m_user', ['token']),
      ...mapState('m_cart', ['cart']),
      // 判断是否全选
      isFullCheck() {
        return this.checkedCount === this.total
      }
    },
    data() {
      return {
        seconds: 3, //倒计时秒数
        timer: null, //用来清除定时器
      };
    },
    methods: {
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      ...mapMutations('m_user', ['updateRedirectInfo']),

      // 点击全选框
      changeAllState() {
        // 将当前全选框的状态取反  传给改变所有商品选中状态的函数
        this.updateAllGoodsState(!this.isFullCheck)
      },
      // 点击结算
      settlement() {
        // 如果没有被勾选的商品
        if (!this.checkedCount) return uni.$showMsg('你还没选择商品呢!')
        // 如果没有地址
        if (!this.addstr) return uni.$showMsg('你还没选择地址呢!')
        // 
        if (!this.token) return this.delayNavigate()
        this.payOrder()
      },
      async payOrder() {
        // 1. 创建订单
        // 1.1 组织订单的信息对象
        const orderInfo = {
          // order_price: this.checkedGoodsAmount,
          order_price: 0.01, // 商品总价
          consignee_addr: this.addstr, // 商品地址
          // 商品信息 先filter过滤出已选中的商品  在map循环 把原本对象里的goods_count属性名变为goods_number
          goods: this.cart.filter(x => x.goods_state).map(x => ({
            goods_id: x.goods_id,
            goods_number: x.goods_count,
            goods_price: x.goods_price,
          })),
        }
        // 1.2 发起请求创建订单
        const {
          data: res
        } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
        if (res.meta.status !== 200) return uni.$showMsg('创建订单失败')
        // 1.3 得到服务器响应的“订单编号”
        const orderNumber = res.message.order_number

        // 2. 订单预支付
        // 2.1 发起请求获取订单的支付信息
        const {
          data: res2
        } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {
          order_number: orderNumber
        })
        // 2.2 预付订单生成失败
        if (res2.meta.status !== 200) return uni.$showError('预付订单生成失败！')
        // 2.3 得到订单支付相关的必要参数
        const payInfo = res2.message.pay

        // 3. 发起微信支付
        // 3.1 调用 uni.requestPayment() 发起微信支付
        const [err, succ] = await uni.requestPayment(payInfo)
        // 3.2 未完成支付
        if (err) return uni.$showMsg('订单未支付！')
        // 3.3 完成了支付，进一步查询支付的结果
        const {
          data: res3
        } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', {
          order_number: orderNumber
        })
        // 3.4 检测到订单未支付
        if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
        // 3.5 检测到订单支付完成
        uni.showToast({
          title: '支付完成！',
          icon: 'success'
        })
      },
      // 延时导航到my页面
      delayNavigate() {
        this.seconds = 3
        this.showTips(this.seconds) // 先调用一次
        this.timer = setInterval(() => {
          this.seconds--
          if (this.seconds <= 0) {
            clearInterval(this.timer) // 清除定时器
            uni.switchTab({
              url: '/pages/my/my',
              success: () => { // 跳转成功触发
                this.updateRedirectInfo({ // 修改vuex中重定向的值
                  openType: 'switchTab',
                  from: '/pages/cart/cart'
                })
              }
            })
            return
          }
          this.showTips(this.seconds)
        }, 1000)
      },
      showTips(n) { // 展示倒计时的提示消息
        uni.showToast({
          icon: 'none',
          title: '请登录后在结算! ' + n + '秒后自动跳转!',
          mask: true,
          duration: 1500
        })
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
