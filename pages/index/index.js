
const DB = wx.cloud.database().collection("swiperList")
const DB1= wx.cloud.database().collection("goodslist")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //轮播图数组
    swiperList:[],
    categories:[],
    recommend:[]
  },

  /**
   * 生命周期函数--监听页面加载
   * 页面启动即触发
   */
  onLoad: function (options) {
    let that =this;
    //获取本地存储的数据
    const Swiper = wx.getStorageSync('swiper');
    const indexCates = wx.getStorageSync('indexcates');
    //判断
    if (!Swiper) {
      //不存在，发送请求数据。
      DB.get({
        success(res) {
          wx.setStorageSync('swiper', {
            time: Date.now(),
            data: res
          })
          that.setData({
            swiperList:res.data
          })
        }
      })
    } else {
      //有旧的数据，判断是否过期，过期时间5分钟
      if (Date.now() - Swiper.time > 1000 * 10) {
        DB.get({
          success(res) {
            wx.setStorageSync('swiper', {
              time: Date.now(),
              data: res
            })
            that.setData({
              swiperList:res.data
            })
          }
        })
      } else {
        //可以使用旧的数据
        let swiperList = Swiper.data.data;
        this.setData({
          swiperList
        })
      }
    }
    if (!indexCates) {
      //不存在，发送请求数据。
      DB1.get({
        success(res) {
          wx.setStorageSync('indexcates', {
            time: Date.now(),
            data: res
          })
          that.setData({
            categories:res.data,
            recommend:(res.data[3].children).concat(res.data[2].children)
          })
        }
      })
    } else {
      //有旧的数据，判断是否过期，过期时间5分钟
      if (Date.now() - indexCates.time > 1000 * 10) {
        DB1.get({
          success(res) {
            wx.setStorageSync('indexcates', {
              time: Date.now(),
              data: res
            })
            that.setData({
              categories:res.data,
              recommend:(res.data[3].children).concat(res.data[2].children)
            })
          }
        })
      } else {
        //可以使用旧的数据
        this.indexCates = indexCates.data
        let categories = this.indexCates.data;
        let recommend = (this.indexCates.data[3].children).concat(this.indexCates.data[2].children)
        this.setData({
          categories,
          recommend
        })
      }

    }
  },
  tocategory:function(e){
    console.log(e)
    wx.reLaunch({
      url: "/pages/category/category?id=" + e.currentTarget.dataset.id
    })
  },
  todetail: function (e) {
    console.log(e)
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },
  // //点击轮播图，放大预览
  // handlePreviewImage(e) {
  //   // console.log('%c'+"预览","color:red;font-size:100px;background-image:linear-gradient(to right,#0094ff,pink)");
  //   //先构造要预览的图片的数组
  //   const urls = this.GoodsInfo.goods_pics.map(v => v.pics_mid);
  //   // 2 接收传递过来的图片url
  //   const current = e.currentTarget.dataset.url;
  //   // console.log(urls)
  //   wx.previewImage({
  //     current,
  //     urls
  //   })
  // },
})