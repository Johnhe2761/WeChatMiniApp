
const DB = wx.cloud.database().collection("goodslist")
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 右侧内容的滚动条距离顶部的距离
    scrollTop: 0,
    categorySelected: {
      name: '饮料',
      id: '1'
    },
    currentGoods: 0,
    onLoadStatus: true,
    category: [],
    goodslist: [],
    skuCurGoods: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //处理首页跳转过来的显示页面
    const {
      id
    } = options;
    console.log(id);
    if(id){
      this.getCategory(id);
    }
    

    //在success'之后的this与这里的this不一样，对整个page异步调用时需要使用这里的this，故存为that
    let that = this
    /*
      先判断本地有没有旧的数据，
      没有旧的数据则直接发送新的请求
      若有旧数据，且没过期，则直接使用
    */
    //获取本地存储的数据
    const Cates = wx.getStorageSync('cates');
    //判断
    if (!Cates) {
      //不存在，发送请求数据。
      
       DB.get({
        success(res) {
          wx.setStorageSync('cates', {
            time: Date.now(),
            data: res
          })
          let len = res.data[0].length
          that.setData({
            category: res.data,
            goodslist: res.data[0].children,
            currentGoods:len
          })
        }
      })
      console.log("不存在数据，发送 请求数据")
    } else {
      //有旧的数据，判断是否过期，过期时间5分钟:1000ms=1s,5min=300s=>1000*300
      
      if (Date.now() - Cates.time > 1000 *300) {
        DB.get({
          success(res) {
            wx.setStorageSync('cates', {
              time: Date.now(),
              data: res
            })
            let len = res.data[0].length
            that.setData({
              category: res.data,
              goodslist: res.data[0].children,
              currentGoods:len

            })
          }
        })
        console.log("有旧数据但已过期")
      } else {
        //可以使用旧的数据
        this.Cates = Cates.data;
        let category = this.Cates.data;
        let goodslist = this.Cates.data[0].children;
        let len = goodslist.length
        console.log("可以使用旧数据")
        this.setData({
          category,
          goodslist,
          currentGoods: len
        })
      }

    }
  },
  toDetailsTap: function (e) {
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },
  onCategoryClick: function (e) {
    var that = this;
    var id = e.target.dataset.id;
    if (id === that.data.categorySelected.id) {
      that.setData({
        scrollTop: 0,
      })
    } else {
      var categoryName = '';
      //遍历类别，根据id找到所点击的类别，存下categoryName
      for (var i = 0; i < that.data.category.length; i++) {
        let item = that.data.category[i];
        if (item.cat_id == id) {
          categoryName = item.name;
          break;
        }
      }
      that.setData({
        categorySelected: {
          name: categoryName,
          id: id
        },
        scrollTop: 0
      });
      // that.getGoodsList(id);
      // wx.showLoading({
      //   title: '加载中',
      // })
      for (var j = 0; j < that.data.category.length; j++) {
        let res = that.data.category[j]
        if (id === res.cat_id) {
          let goodslist = res.children
          let len =goodslist.length
          this.setData({
            goodslist,
            currentGoods:len
          })
          // wx.hideLoading()
          break;
        }
      }
    }
  },
  //跳转指定类别
  async getCategory(id) {
    let that = this;
    DB.where({
      cat_id: id
    }).get({
      success(res) {
        wx.showLoading({
          title: '加载中',
        })
        for (var j = 0; j < that.data.category.length; j++) {
          that.setData({
            goodslist:[]
          })
          let currentcategory = that.data.category[j]
          if (id === currentcategory.cat_id) {
            let goodslist = currentcategory.children
            let len = goodslist.length
            that.setData({
              goodslist,
              currentGoods:len
            })
            break;
          }
        }

        that.setData({
          categorySelected: {
            name: res.data[0].cat_name,
            id: res.data[0].cat_id,
          },
        })
        wx.hideLoading()
      }
    })
  }
})