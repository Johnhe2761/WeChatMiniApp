// pages/super/super.js
import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from "../../utils/asyncWx.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paidorder:{},
    payafterorder:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow(){
    this.getorder();
  },
  /**
   * 生命周期函数--监听页面显示
   */

  getpaidorder(){
    wx.navigateTo({
      url: '/pages/super_paid/super_paid',
    })
  },
  getnotpaidorder(){
    wx.navigateTo({
      url: '/pages/super_payafter/super_payafter',
    })
  },
  async getorder(){
    wx.showLoading({
      title: '请稍候',
      mask: true,
    })
      let paidOrder =await wx.cloud.callFunction({
        name:'getsuperorder',
        data:{
          paytype:0//在线支付
        }
      })
      // console.log(paidOrder)
      this.setData({
        paidorder:paidOrder.result.data,
        num_0:paidOrder.result.data.length
      })
      wx.setStorageSync('paidorder', paidOrder.result.data)
      let payafterOrder =await wx.cloud.callFunction({
        name:'getsuperorder',
        data:{
          paytype:1//货到付款
        }
      })
      // console.log(payafterOrder)
      this.setData({
        payafterorder:payafterOrder.result.data,
        num_1:payafterOrder.result.data.length
      })
      wx.setStorageSync('payafter', payafterOrder.result.data)
    wx.hideLoading()
  }

})