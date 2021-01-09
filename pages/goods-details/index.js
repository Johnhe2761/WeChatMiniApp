// pages/goods-details/index.js
/*
  发送请求获取数据 
  点击轮播图，大图预览
    给轮播图绑定一个点击事件
    预览的本质是调用小程序的api中的previewImage
  点击加入购物车
    点击绑定事件 
    获取缓存中的购物车数据 数组格式/对象格式
    先判断当前商品是否已经存在于购物车
      若存在则需要修改数据 执行购物车数量++ 重新把购物车数组填充到缓存中
      不存在于购物车数组中的 直接给购物车添加一个新元素即可，需要带上购买属性 同时填充到缓存中
    弹出提示

*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsdetail: [],
    buynowcart: []
  },
  //全局对象,商品对象
  GoodsInfo: {},


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {
      id
    } = options;
    console.log(id);
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    this.getGoodsDetail(id);
  },

  //获取商品的详情数据
  async getGoodsDetail(id) {

    let that = this;
    wx.cloud.callFunction({
      name: "getdetail",
      data: {
        id: id
      },
      success(res) {
        console.log("云函数取得商品详情", res)
        that.GoodsInfo = res.result.data[0];
        // console.log(this.GoodsInfo)
        that.setData({
          goodsdetail: res.result.data[0]
        })
      }
    })
  },
  //点击轮播图，放大预览
  handlePreviewImage(e) {
    // console.log('%c'+"预览","color:red;font-size:100px;background-image:linear-gradient(to right,#0094ff,pink)");
    //先构造要预览的图片的数组
    const urls = this.GoodsInfo.goods_pics.map(v => v.pics_mid);
    // 2 接收传递过来的图片url
    const current = e.currentTarget.dataset.url;
    // console.log(urls)
    wx.previewImage({
      current,
      urls
    })
  },
  //点击加入购物车
  handleCartAdd() {
    // console.log("gouwuche")
      //获取缓存中的购物车数组
      let cart = wx.getStorageSync('cart') || []; //第一次获取数据时空字符串，转为数组格式
      //判断商品对象是否存在于购物车数组中
      let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
      if (index === -1) {
        //不存在 第一次添加
        this.GoodsInfo.num = 1;
        this.GoodsInfo.checked = true;
        cart.push(this.GoodsInfo);
      } else {
        //已经存在购物车数据，执行num++
        cart[index].num++;
      }
      //把购物车重新添加会缓存中
      wx.setStorageSync('cart', cart);
      //弹窗提示
      wx.showToast({
        title: '加入成功',
        icon: 'success',
        //true 防止用户疯狂点击,
        mask: true
      });
  },
  //点击立即购买
  buynow() {
    this.GoodsInfo.num = 1;
    this.GoodsInfo.checked = true;
    this.data.buynowcart.push(this.GoodsInfo);
    //把购物车重新添加到缓存中
    wx.setStorageSync('buynowcart', this.data.buynowcart);
    wx.redirectTo({
      url: '/pages/buynow/buynow',
    })
  }

})