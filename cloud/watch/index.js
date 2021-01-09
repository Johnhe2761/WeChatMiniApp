// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "",
})
const _ = cloud.database().command
const DB = cloud.database().collection("users")
// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  const watcher = DB.where({
    user_super:false
  }).watch({
    onchange:function(snapshot){
      console.log('docs\'s changed events', snapshot.docChanges)
      console.log('query result snapshot after the event', snapshot.docs)
      console.log('is init data', snapshot.type === 'init')
    },
    onError:function(err){
      console.error('the watch closed because of error', err)
    }
  })
  watcher.close();
  return watcher
}