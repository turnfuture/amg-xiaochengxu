const app = getApp();
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    code:'',//邀请码
    shopId:''
  },
  onLoad: function (options) {
    console.log(options)
    wx.setStorageSync('isFirst', false)
    var that = this;
    if(options.code){
      that.setData({
        code: options.code
      })
    }
    if (options.shopId) {
      that.setData({
        shopId: options.shopId
      })
    }
   
  },
  bindGetUserInfo: function (e) {
   var that = this;
    if (e.detail.userInfo) {
      wx.login({
        success: res => {
          var resCode = res;
          console.log('resCode', resCode)
          wx.getUserInfo({
            success: res => {
              console.log('userInfo', res)
              var userInfo = res.userInfo;
              wx.showLoading({
                title: '正在加载中',
              })
              wx.request({
                url: getApp().data.url + '/api/member/user/getUserInfo',
                data: {
                  code: resCode.code,
                  encryptedData: res.encryptedData,
                  iv: res.iv,
                  InvitationCode:that.data.code,
                  shopId: that.data.shopId
                },
                method: "post",
                header: {
                  'Content-Type': 'application/json'
                },
                success: function (res) {
                  wx.hideLoading()
                  console.log('getUserInfo', res)
                  if(res.data.code==0){
                    var str = res.data.data;
                    wx.setStorageSync('id', res.data.data.id);
                    wx.navigateBack({
                      delta: 1
                    })
                  }else{
                    wx.showToast({
                      title: res.data.msg,
                      icon:'none',
                      duration:2000
                    })
                  }
                },fail:function(res){
                  wx.hideLoading();
                  wx.showToast({
                    title: res,
                    duration:10000
                  })
                }
              })
            },
            fail: function () {
             wx.showToast({
               title: '无法获取信息,请重试',
             })
            }
          })
        }
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
          }
        }
      })
    }
  },
})