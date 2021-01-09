/* 
1 页面被打开的时候 onShow 
  0 onShow 不同于onLoad 无法在形参上接收 options参数 
  0.5 判断缓存中有没有token 
    1 没有 直接跳转到授权页面
    2 有 直接往下进行 
  1 获取url上的参数type
  2 根据type来决定页面标题的数组元素 哪个被激活选中 
  2 根据type 去发送请求获取订单数据
  3 渲染页面
2 点击不同的标题 重新发送请求来获取和渲染数据 
 */
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
    existorder:0,
    orders: [],
    tabs: [{
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "未付款",
        isActive: false
      },
      {
        id: 2,
        value: "待发货",
        isActive: false
      },
      {
        id: 3,
        value: "货到付款",
        isActive: false
      }
    ]
  },

  onShow(options) {
    
    //获取缓存中已经登陆的用户的信息user
    const user = wx.getStorageSync('user');
    this.setData({
      user
    })

    //判断是否已经登录
    if (JSON.stringify(user)==='{}') {
      console.log("未登录，无法进入订单页面")
      showModal({
        title: '提示',
        content: '请您先登录',
        cancelText: '',
        confirmText: '确定',
        showCancel: false
      })
      wx.navigateBack({
        delta: 0,
      })
    } else {
      console.log("已经登陆，允许进入订单页面")
    }
    //onShow中无法直接options获得页面参数，故使用下面的方法
    // 1 获取当前的小程序的页面栈-数组 长度最大是10页面 
    let pages = getCurrentPages();
    // 2 数组中 索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    // 3 获取url上的type参数
    const {
      type
    } = currentPage.options;
    console.log("页面类型：", type)
    // 4 激活选中页面标题 当 type=1 index=0 
    this.changeTitleByIndex(type - 1);
    wx.removeStorage({
      key: 'orders',
      success (res) {
        console.log(res)
      }
    })
    this.getOrders(type);
  },

  // 获取订单列表的方法
  async getOrders(type) {
    wx.showLoading({
      title: '加载中',
    })
    //获取订单
    let res = await wx.cloud.callFunction({
      name: 'getorderlist',
      data: {
        ordertype: type
      }
    })
    // console.log(res)
    if (res.result.length != 0) {
      //将返回的数据存为对象并返回order_number转化成的时间
      this.setData({
        orders: res.result.map(v => ({...v,time: (new Date(v.order_number).toLocaleString())}))
      })
      this.setData({
        existorder:1
      })
      wx.setStorageSync('orders', res.result.map(v => ({...v,time: (new Date(v.order_number).toLocaleString())})))
    }
    else{
      this.setData({
        orders:[],
        existorder:0
      })
    }
    wx.hideLoading()
  },
  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index) {
    // 2 修改源数组
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => v.id === index ? v.isActive = true : v.isActive = false);
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const {
      index
    } = e.detail;
    this.changeTitleByIndex(index);
    // 2 重新发送请求 type=1 index=0
    this.getOrders(index + 1);
  },
  toIndexPage() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  todetails(e){
    wx.navigateTo({
      url: '/pages/order_details/order_details?id='+e.currentTarget.dataset.id,
    })
  }
})