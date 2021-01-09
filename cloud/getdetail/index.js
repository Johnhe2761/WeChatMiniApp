// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "",
  traceUser: true
})
const DB = cloud.database().collection("goodsdetail")
// 云函数入口函数
exports.main = async (event, context) => {
  return await DB.where({
    goods_id:event.id+''
  }).get();
}