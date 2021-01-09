// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "",
})
const _ = cloud.database().command
const DB = cloud.database().collection("users")
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  //更新状态status
  let res1 = await DB.where({
    user_openid: wxContext.OPENID,
  }).get()
  console.log(res1)
  let arraynum = res1.data[0].user_ordernum - 1
  let id = res1.data[0]._id
  
  return await DB.doc(id).update({
    data: {
      [`user_order.${arraynum}.sent`]: true
    } //es6
  })
}