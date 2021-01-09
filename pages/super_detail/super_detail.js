
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
    let paid = wx.getStorageSync('paidorder')||[];
    let payafter = wx.getStorageSync('payafter')||[];
    this.setData({
      paid,
      payafter
    })
    for(var i =0;i<paid.length;++i){
      if(this.data.id == paid[i].order_number){
        this.setData({
          theone :paid[i]
        })
      }
    }
    for(var i =0;i<payafter.length;++i){
      if(this.data.id == payafter[i].order_number){
        this.setData({
          theone :payafter[i]
        })
      }
    }
  },
async delete(){
  let res = await wx.cloud.callFunction({
    name:'delete',
    data:{
      order_number:this.data.theone.order_number
    }
  })
  showToast({
    title:'确认送达成功！正在返回管理员页面'
  })
  console.log(res)
  
  
  wx.navigateBack({
    delta: 2,
  })
}
})