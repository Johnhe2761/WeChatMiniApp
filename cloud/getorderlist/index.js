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
  let res = await DB.where({
    user_openid: wxContext.OPENID
  }).field({
    user_order: true
  }).get();

  var type1 = []
  type1 = res.data[0].user_order
  var len = type1.length
  //逆置type1,使订单日期越晚排在越前
  var temp;//定义交换变量
	for (var i = 0; i < len /2; ++i) {
	//将a[0]与a[n]进行交换 然后是a[1]与a[n-1]交换，以此类推，进行顺序表的长度的一半次运算
		temp = type1[i];
		type1[i] = type1[len-i-1];
		type1[len-i-1] = temp;
	}

  if (event.ordertype == 1) {
    console.log(type1)
    return type1
  }
  if (event.ordertype == 2) {
    var type2 = []
    for (var i = 0; i < type1.length; ++i) {
      if (type1[i].status == 0 && type1[i].paytype == 0 && type1[i].sent == false) {
        type2.push(type1[i])
      }
    }
    console.log(type2)
    return type2
  }
  if (event.ordertype == 3) {
    var type3 = []
    for (var i = 0; i < type1.length; ++i) {
      if (type1[i].status == 1 && type1[i].paytype == 0 && type1[i].sent == false) {
        type3.push(type1[i])
      }
    }
    console.log(type3)
    return type3;
  }
  if (event.ordertype == 4) {
    var type4 = []
    for (var i = 0; i < type1.length; ++i) {
      if (type1[i].paytype == 1 && type1[i].sent == false) {
        type4.push(type1[i])
      }
    }
    console.log(type4)
    return type4;
  }
}