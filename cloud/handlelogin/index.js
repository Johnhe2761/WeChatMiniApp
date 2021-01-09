// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "",
  traceUser: true
})
const DB = cloud.database().collection("users")
const _ = cloud.database().command
// 云函数入口函数
exports.main = async (event, context) => {
  //获取openid,并以此查询数据库返回查询结果
  const wxContext = cloud.getWXContext()
  let result = await DB.where({
    user_openid: wxContext.OPENID
  }).get();
  console.log(result)
  //判断返回的查询结果是否为空，若为空则说明是新用户，否则是老用户。
  //为新用户在数据库中插入数据
  if (result.data.length === 0) {
    console.log("添加新用户")
    await cloud.callFunction({
      name: "adduser",
      data: {
        user_openid: wxContext.OPENID
      }
    })
     let newone =await DB.where({
      user_openid: wxContext.OPENID
    }).get();
    return {newone,new:true}
  } else {
    console.log("老用户")
    return {result,new:false};
  }
}