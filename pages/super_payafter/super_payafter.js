// pages/super_paid/super_paid.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  onShow(){
    const order = wx.getStorageSync('payafter')
    this.setData({
      order:order.map(v => ({...v,time: (new Date(v.order_number).toLocaleString())}))
    })
  },
  todetail(e){
    console.log(e)
    wx.navigateTo({
      url: "/pages/super_detail/super_detail?id="+e.currentTarget.dataset.id,
    })
  }
  
})