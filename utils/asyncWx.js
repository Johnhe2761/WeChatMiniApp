/*
promise 形式 gstSetting
*/
export const getSetting=()=>{
  return new Promise((resolve,reject)=>{
    wx.getSetting({
      success:(result)=>{
        resolve(result);
      },
      fail:(err)=>{
        reject(err);
      }
    });
  })
}
/*
promise 形式 chooseAddress
*/
export const chooseAddress=()=>{
  return new Promise((resolve,reject)=>{
    wx.chooseAddress({
      success:(result)=>{
        resolve(result);
      },
      fail:(err)=>{
        reject(err);
      }
    });
  })
}
/*
promise 形式 openSetting
*/
export const openSetting=()=>{
  return new Promise((resolve,reject)=>{
    wx.openSetting({
      success:(result)=>{
        resolve(result);
      },
      fail:(err)=>{
        reject(err);
      }
    });
  })
}
/*
promise 形式 showModal
*/
export const showModal=({title,content,cancelText,confirmText,showCancel})=>{
  return new Promise((resolve,reject)=>{
    wx.showModal({
      title: title,
      content: content,
      cancelText:cancelText,
      confirmText:confirmText,
      showCancel:true,
      success: (res)=> {
        resolve(res);
      },
      fail:(res)=>{
        reject(res);
      }
    })
  })
}
/*
promise 形式 showToast
*/
export const showToast=({title})=>{
  return new Promise((resolve,reject)=>{
    wx.showToast({
      title: title,
      icon:'none',
      success: (res)=> {
        resolve(res);
      },
      fail:(res)=>{
        reject(res);
      }
    })
  })
}
/*
promise 形式 requestPayment 
*/
export const ml_payment=(pay)=>{
  return new Promise((resolve,reject)=>{
    wx.requestPayment({
      ...pay,//展开pay这个对象
      success:resolve,
      fail:reject
    })
  })
}