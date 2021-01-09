// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "",
})
// const _ = cloud.database().command
const DB = cloud.database().collection("ordertosend")
// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  return await DB.where({
    paytype:event.paytype,
  }).get()
}