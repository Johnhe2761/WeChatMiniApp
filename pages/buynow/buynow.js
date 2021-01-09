/* 
1 获取用户的收货地址
  1 绑定点击事件
  2 调用小程序内置 api  获取用户的收货地址  wx.chooseAddress

  2 获取 用户 对小程序 所授予 获取地址的  权限 状态 scope
    1 假设 用户 点击获取收货地址的提示框 确定  authSetting scope.address 
      scope 值 true 直接调用 获取收货地址
    2 假设 用户 从来没有调用过 收货地址的api 
      scope undefined 直接调用 获取收货地址
    3 假设 用户 点击获取收货地址的提示框 取消   
      scope 值 false 
      1 诱导用户 自己 打开 授权设置页面(wx.openSetting) 当用户重新给与 获取地址权限的时候 
      2 获取收货地址
    4 把获取到的收货地址 存入到 本地存储中 
2 页面加载完毕
  0 onLoad  onShow 
  1 获取本地存储中的地址数据
  2 把数据 设置给data中的一个变量
3 onShow 
  0 回到了商品详情页面 第一次添加商品的时候 手动添加了属性
    1 num=1;
    2 checked=true;
  1 获取缓存中的购物车数组
  2 把购物车数据 填充到data中
4 全选的实现 数据的展示
  1 onShow 获取缓存中的购物车数组
  2 根据购物车中的商品数据 所有的商品都被选中 checked=true  全选就被选中
5 总价格和总数量
  1 都需要商品被选中 我们才拿它来计算
  2 获取购物车数组
  3 遍历
  4 判断商品是否被选中
  5 总价格 += 商品的单价 * 商品的数量
  5 总数量 +=商品的数量
  6 把计算后的价格和数量 设置回data中即可
6 商品的选中
  1 绑定change事件
  2 获取到被修改的商品对象
  3 商品对象的选中状态 取反
  4 重新填充回data中和缓存中
  5 重新计算全选。总价格 总数量。。。
7 全选和反选
  1 全选复选框绑定事件 change
  2 获取 data中的全选变量 allChecked
  3 直接取反 allChecked=!allChecked
  4 遍历购物车数组 让里面 商品 选中状态跟随  allChecked 改变而改变
  5 把购物车数组 和 allChecked 重新设置回data 把购物车重新设置回 缓存中 
8 商品数量的编辑
  1 "+" "-" 按钮 绑定同一个点击事件 区分的关键 自定义属性 
    1 “+” "+1"
    2 "-" "-1"
  2 传递被点击的商品id goods_id
  3 获取data中的购物车数组 来获取需要被修改的商品对象
  4 当 购物车的数量 =1 同时 用户 点击 "-"
    弹窗提示(showModal) 询问用户 是否要删除
    1 确定 直接执行删除
    2 取消  什么都不做 
  4 直接修改商品对象的数量 num
  5 把cart数组 重新设置回 缓存中 和data中 this.setCart
9 点击结算
  1 判断有没有收货地址信息
  2 判断用户有没有选购商品
  3 经过以上的验证 跳转到 支付页面！ 
 */
import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from "../../utils/asyncWx.js";
Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0,
    pre_address: {},
    user: {},
    order:{}
  },
  onShow() {
    //获取缓存中的收货地址信息
    const address = wx.getStorageSync('address');
    //获取缓存中的购物车数据
    const cart = wx.getStorageSync('buynowcart') || []; //确保类型正确
    //获取缓存中已经登陆的用户的信息user
    const user = wx.getStorageSync('user')||{};
    this.setData({
      user,
      address
    })
    this.setCart(cart);

    //根据购物车中的商品数据进行计算： 所有商品都被选中则全选自动选上，否则不选。
    //计算全选
    //every数组方法会遍历，会接受一个回调函数，每一个回调函数都返回true，那么every方法的返回值就是true，只要有一个false则直接返回false
    //注意，空数组调用every返回true
    // const allChecked=cart.length?cart.every(v=>v.checked):false;

  },
  //点击收货地址
  async handleChooseAddress() {
    try {
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      if (scopeAddress === false) {
        await openSetting();
      }
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      //存入缓存
      wx.setStorageSync('address', address);
    } catch (error) {
      console.log(error);
    }
  },
  //商品的选中
  handeItemChange(e) {
    //获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    //获取购物车数组
    let {
      cart
    } = this.data;
    //找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    //选中状态取反
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },
  //设置购物车状态以及工具栏数据计算
  setCart(cart) {

    //计算
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });
    //判断cart是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    //给data赋值
    this.setData({
      cart,
      allChecked,
      totalNum,
      totalPrice
    })
    wx.setStorageSync('cart', cart)
  },
  //商品全选功能
  handleItemAllCheck() {
    //获取data中的数据
    let {
      cart,
      allChecked
    } = this.data;
    //修改值
    allChecked = !allChecked;
    //循环修改cart数组
    cart.forEach(v => v.checked = allChecked);
    //把修改后的值，设置回data和缓存中
    this.setCart(cart);
  },

  //商品数量编辑功能
  async handleItemNumEdit(e) {
    let that = this;
    //获取事件传递过来的参数
    const {
      operation,
      id
    } = e.currentTarget.dataset;
    // console.log(operation,id)
    //获取购物车数组
    let {
      cart
    } = this.data;
    //找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    //判断是否要删除
    if (cart[index].num === 1 && operation === -1) {
      const res = await showModal({
        title: '提示',
        content: '您是否要删除该商品？',
        cancelText: '取消',
        confirmText: '确认',
        showCancel: 'true'
      });
      if (res.confirm) {
        cart.splice(index, 1);
        that.setCart(cart);
      }
    } else { //修改数量
      cart[index].num += operation;
      this.setCart(cart);
    }
  },
  //点击结算
  async handlePay() {
    //先判断是否已经登陆，若未登录则显示无法下单
    //判断是否已经登录，若没有登陆则先跳转到个人中心页面进行登录
    //获取缓存中已经登陆的用户的信息user
    const user = wx.getStorageSync('user')||{};
    if (JSON.stringify(user)==='{}') {
      wx.removeStorage({
        key: 'user',
        success (res) {
          console.log(res)
        }
      })
      console.log("未登录")
      const res = await showModal({
        title: '提示',
        content: '请您先登录',
        cancelText: '暂不登录',
        confirmText: '去登录',
        showCancel: 'true'
      });
      if (res.confirm) {
        wx.switchTab({
          url: '/pages/user/user',
        }),
        wx.removeStorageSync('buynowcart')
        return;
      }else{return;}
    } else {
      console.log("已经登陆")
    }
    
      //判断收货地址
      const {
        address
      } = this.data;
      if (!address.userName) {
        await showToast({
          title: "您还没有选择收货地址"
        });
        return;
      }
      //判断用户有没有选购商品
      if (this.data.totalNum === 0) {
        await showToast({
          title: "您还没有选购商品"
        });
        return;
      }
    //弹出对话框，选择货到付款/在线支付,
    //  货到付款则直接跳到订单页面
    //  在线支付则跳到支付页面
    const choose = await showModal({
      title: '请选择支付方式',
      content: '本小区内内免配送费',
      cancelText: '货到付款',
      confirmText: '在线支付',
      showCancel: 'true'
    });

    if (choose.confirm) {
      //选择在线支付，跳到支付页面
      let user_paytype = 0;
      this.setData({
        user_paytype
      })
      wx.setStorageSync('user_paytype', user_paytype)
      wx.reLaunch({
        url: '/pages/pay/pay?type='+user_paytype,
      })
    } else { 
       //选择货到付款，跳到订单页面
      let user_paytype = 1;
      // wx.setStorageSync('user', data)
      this.setData({
        user_paytype
      })
      wx.setStorageSync('user_paytype', user_paytype)
      wx.reLaunch({
        url: '/pages/pay/pay?type='+user_paytype,
      })
      wx.setNavigationBarTitle({ 
        title:'确认订单'
        })
    }
    
  },
  //更改地址
  async changeaddress() {
    let pre_address = wx.getStorageSync('address');
    let address = await chooseAddress();
    pre_address.all = pre_address.provinceName + pre_address.cityName + pre_address.countyName + pre_address.detailInfo;
    address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
    if (pre_address.all === address.all) {
      await showToast({
        title: "地址未改变"
      });
    } else {
      await showToast({
        title: "地址修改成功！"
      });
      //存入缓存
      try {
        wx.setStorageSync('address', address);
      } catch (error) {
        console.log(error);
      }
      this.setData({
        address
      })
    }
  }

})