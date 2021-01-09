wx-App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    //云开发环境初始化
    wx.cloud.init({
      env:"",
      traceUser: true
    })
  }
})
