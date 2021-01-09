// pages/pay/pay.js


import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast,
  ml_payment
} from "../../utils/asyncWx.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0,
    order_number: 0,
    type: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const {
      type
    } = options;
    console.log(type);
    this.setData({
      type
    })

  },
  onShow() {
    // 1 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 1 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    //获取缓存中已经登陆的用户的信息user
    const user = wx.getStorageSync('user');
    this.setData({
      user,
      address
    })
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked);
    // 1 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    })
    this.setData({
      cart,
      totalPrice,
      totalNum //暂时没用上
    });
    const DB = wx.cloud.database().collection("users")
    //监听新订单
    // console.log(user.user_openid)
    //不要用const定义watchr，否则在page里的其他地方访问不到
    this.watcher = DB.field({
      user_order: true
    }).where({
      _id: user._id
    }).watch({
      onChange: function (snapshot) {
        console.log(snapshot)
        if (snapshot.type == undefined) {
          var order = snapshot.docs[0].user_order;
          var i = order.length - 1;
          if ((order[i].status == 1 && order[i].paytype == 0) || order[i].paytype == 1) { //若是在线支付且未支付则不上传订单
            let addresult = wx.cloud.callFunction({
              name: 'ordertosend',
              data: {
                order: order[i] //只上传最新的订单
              }
            })
            console.log(addresult)
          }
        }
      },
      onError: function (err) {
        console.error('the watch closed because of error', err)
      }
    })
  },

  // 点击 支付 
  async handleOrderPay() {
    const res = await showModal({
      title: '提示',
      content: '送货时间：24小时内送货上门',
      cancelText: '取消',
      confirmText: '确定',
    });
    if (res.confirm) {

      wx.showLoading({
        title: '正在创建订单',
        mask: true
      })


      setTimeout(function () {
        wx.hideLoading()
      }, 5000)
      try {
        //  准备参数
        const order_price = this.data.totalPrice;
        const consignee_addr = this.data.address.all;
        const cart = this.data.cart;
        //从购物车中选出需要的商品信息存入goods中
        let goods = [];
        cart.forEach(v => goods.push({
          goods_id: v.goods_id,
          goods_name: v.goods_name,
          goods_number: v.num,
          goods_price: v.goods_price
        }))

        //创建订单，同时将订单存入users集合的user_order数组中
        await wx.cloud.callFunction({
          name: "createorder",
          data: {
            carts: goods,
            address: consignee_addr,
            order_price: order_price,
            paytype: 0
          }
        }).then(v => {
          this.setData({
            order_number: v.result.order_number
          })
        })
        console.log("发起订单", this.data.order_number)

        //预支付
        let res2 = await wx.cloud.callFunction({
          name: "pay",
          data: {
            order_number: this.data.order_number,
            totalfee: order_price,
          }
        })
        console.log("预支付", order_price, res2)

        //发起支付
        await ml_payment(res2.result)
        console.log("支付成功")
        //更新支付状态 =》已支付
        let res3 = await wx.cloud.callFunction({
          name: 'updateStatus',
          data: {
            order_number: this.data.order_number
          }
        })
        console.log("支付状态更新", res3)

        //清空购物车
        let newCart = wx.getStorageSync("cart");
        newCart = newCart.filter(v => !v.checked);
        wx.setStorageSync("cart", newCart);
        wx.setStorageSync('buynowcart', [])
        showToast({
          title: "支付成功！",
          //true 防止用户疯狂点击,
          mask: true
        })
        // 支付成功了 跳转到订单页面
        wx.redirectTo({
          url: '/pages/order/order?type=' + 3
        });

      } catch (error) {
        await showToast({
          title: "支付失败",
          //true 防止用户疯狂点击,
          mask: true
        })
        console.log(error);
      }
    }
  },

  //点击确认订单
  async handleOrderconfirm() {
    const res = await showModal({
      title: '提示',
      content: '送货时间：24小时内送货上门',
      cancelText: '取消',
      confirmText: '确定',
    });
    if (res.confirm) {

    showToast({
      title: "正在创建订单",
      //true 防止用户疯狂点击,
      mask: true
    })

    //  准备参数
    const order_price = this.data.totalPrice;
    const consignee_addr = this.data.address.all;
    const cart = this.data.cart;
    let goods = [];
    cart.forEach(v => goods.push({
      goods_id: v.goods_id,
      goods_name: v.goods_name,
      goods_number: v.num,
      goods_price: v.goods_price
    }))

    //创建订单，同时将订单存入users集合的user_order数组中
    await wx.cloud.callFunction({
      name: "createorder",
      data: {
        carts: goods,
        address: consignee_addr,
        order_price: order_price,
        paytype: 1
      }
    }).then(v => {
      this.setData({
        order_number: v.result.order_number
      })
    })
    console.log("发起订单", this.data.order_number)
    showToast({
      title: "正在创建订单",
      //true 防止用户疯狂点击,
      mask: true
    })
    //清空购物车
    let newCart = wx.getStorageSync("cart");
    newCart = newCart.filter(v => !v.checked);
    wx.setStorageSync("cart", newCart);
    wx.setStorageSync('buynowcart', [])
    showToast({
      title: "下单成功！",
      //true 防止用户疯狂点击,
      mask: true
    })
    // 下单成功了 跳转到订单页面
    wx.redirectTo({
      url: '/pages/order/order?type=' + 4
    });
  }
  },
  onUnload() {
    this.watcher.close()
  }
})