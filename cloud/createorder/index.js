// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "",
  traceUser: true
})
const _= cloud.database().command
const DB2 = cloud.database().collection("users")
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  //创建一个随机订单号组成一个对象
  let obj = {
    order_number:Date.now(),
    carts: event.carts,
    status:0,//0-未支付  1-已支付 
    order_price:event.order_price,
    address:event.address,
    paytype:event.paytype,
    sent:false
  }
  //将订单添加到user_order数组中,并更新ordernum+1
  await DB2.where({
    user_openid : wxContext.OPENID
  }).update({
    data:{
      user_order : _.addToSet(obj),
      user_ordernum: _.inc(1)
    }
  })
  return {
    order_number:obj.order_number
  }
}