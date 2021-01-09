// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "",
})

const DB1 = cloud.database().collection("users")
const DB2 = cloud.database().collection("ordertosend")
// 云函数入口函数
exports.main = async (event, context) => {
  return await DB2.where({
    order_number:event.order_number
  }).remove()
  
}