// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env:"",
  traceUser: true
})
const DB = cloud.database().collection("users")
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await DB.add({
      data: {
        user_openid: event.user_openid,
        user_collection: [],
        user_cart: [],
        user_history: [],
        user_order: [],
        user_ordernum:0,
        user_super:false
      }
    })
  } catch (e) {
    console.error("添加新用户失败",e)
  }

}