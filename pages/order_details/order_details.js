
import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from "../../utils/asyncWx.js";
// pages/super_detail/super_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showbutton:false,
    showbutton2:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const{
      id
    }=options
    console.log(id);
    this.setData({
      id:id
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let orders = wx.getStorageSync('orders')||[]
    this.setData({
      orders
    })
    for(var i =0;i<orders.length;++i){
      if(this.data.id == orders[i].order_number){
        this.setData({
          theone :orders[i]
        })
      }
    }
    if((this.data.theone.status == 1&&this.data.theone.paytype == 0&&this.data.theone.sent==false)){
      this.setData({
        showbutton:true,
        showbutton2:true
      })
    }
    if(this.data.theone.paytype == 1&&this.data.theone.sent==false)
    this.setData({
      showbutton2:true
    })
  },
refund(){
  showModal({
    title: '提示',
    content: '请您联系客服：xxxxxxx',
    cancelText: '取消',
    confirmText: '确认',
    showCancel: 'true'
  });
},
sent(){
  let res =wx.cloud.callFunction({
    name:'updateSent',
  })
  console.log(res)
  showToast({
    title:'确认收货成功，正在返回'
  })
  wx.navigateBack({
    delta: 0,
  })
}
})