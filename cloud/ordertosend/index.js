// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "",
})
const DB = cloud.database().collection("ordertosend")
// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  //将订单添加到user_order数组中,并更新ordernum+1
  return await DB.add({
    data:
      event.order
  })
}