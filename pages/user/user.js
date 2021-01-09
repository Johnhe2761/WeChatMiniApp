// pages/user/index.js
/*
  需求：
  加入购物车的操作、进入购物车页面、个人中心点击相关按钮以及点击登录按钮都要获取用户的openid然后从数据库中读取相应的数据
  实现：
  1.获取用户的信息并显示到个人中心页面上
  2.获取用户的openid并在数据库的users这个collection中查询，若没有该用户则插入。若有该用户则获取用户的所有相关信息并存入appdata中。
*/

const DB = wx.cloud.database().collection("users")
Page({
  data: {
    userinfo: {},
    user: {},
    // 被收藏的商品的数量
    collectNums: 0
  },
  onShow() {
    const userinfo = wx.getStorageSync("userinfo");
    const collect = wx.getStorageSync("collect") || [];
    const user = wx.getStorageSync('user');
    this.setData({
      userinfo,
      user,
      super: user.user_super,
      collectNums: collect.length
    });
  },


  //读取用户信息和openid，判断是否为老用户，若为老用户则获取数据库中已有的信息存入缓存。新用户则新建记录
  async handleGetUserInfo(e) {

    this.setData({
      wxlogin: true
    })
    let that = this;
    
    //登录按钮，首先获取用户的信息
    const {
      userInfo
    } = e.detail;
    wx.setStorageSync("userinfo", userInfo);

    //获取用户唯一的openid，查询数据库
    wx.cloud.callFunction({
      name: "handlelogin",
      success(res) {
        console.log("云函数调用成功", res)
        //若是老用户，直接将个人数据存入缓存,同时判断是不是管理员
        if (res.result.new == false) {
          console.log("老用户读取数据成功")
          //判断管理员
          wx.setStorageSync('user', res.result.result.data[0])
          that.setData({
            user: res.result.result.data[0],
            super: res.result.result.data[0].user_super
          })

        } else {
          //若是新用户,在数据库建立新记录，同时返回该记录存入缓存
          console.log("新用户建立并读取成功")
          wx.setStorageSync('user', res.result.newone.data[0])
          that.setData({
            user: res.result.newone.data[0]
          })
        }
      },
      fail(res) {
        console.log("云函数调用失败", res);
      },
     
    })
    //刷新页面
    this.onShow();
  },
  cancelLogin() {
    this.setData({
      wxlogin: true
    })
  },
  sharemenu: function () {
    console.log("打开转发页面");
    wx.showToast({
      title: '该功能暂未上线',
      icon: 'none'
    })
    // wx.showShareMenu({
    //   withShareTicket: true,
    //   menus: ['shareAppMessage', 'shareTimeline']
    // })
  },
  tosuperpage: function () {
    wx.navigateTo({
      url: '/pages/super/super',
    })
  },
  manage() {
    wx.showToast({
      title: '该功能暂未上线',
      icon: 'none'
    })
  }
})