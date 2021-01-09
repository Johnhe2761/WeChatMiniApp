// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: "",
  traceUser: true
})
//引入tenpay
const tenpay = require('tenpay');
//配置
const config = {
  appid:'',
  mchid:'',//商户号
  partnerKey:'',//支付密钥
  notify_url:'',//支付回调函数
  spbill_create_ip:''//IP地址
}
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  //初始化
  const api = tenpay.init(config);
  console.log(event.order_number)
  //获取支付参数 getPayParams：获取微信JSSDK支付参数（自动下单，兼容小程序）
  let result  = await api.getPayParams({
    out_trade_no: event.order_number +'',//    商户内部订单号,+'',转number为string
    body:'陌上玫瑰超市',//商品简单描述
    total_fee:event.totalfee*100,//订单总金额单位为 分，改为 1
    openid:wxContext.OPENID//付款用户的openid
  })

  return result
}