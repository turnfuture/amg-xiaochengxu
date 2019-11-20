// pages/goPresen/goPresen.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: '',
    num: '',
    kPrice: '',
  },
  tixian: function() {
    let _this = this
    let kmoney = _this.data.kPrice;
    let num = _this.data.num;
    let money = (_this.data.money * 1).toFixed(2);
    if (money<=0) {
      wx.showToast({
        title: '请输入正确的提现金额',
        icon:'none',
        duration:2000
      })
      return
    } else if (!num||num === '') {
      wx.showToast({
        title: '请输入账号',
        icon: 'none',
        duration:2000
      })
      return
    } else if (money > kmoney){
      wx.showToast({
        title: '余额不足，请重新输入',
        icon: 'none',
        duration: 2000
      })
      return
    };
    
    wx.request({
      url: app.data.url + '/api/extract/goExtract',
      data: {
        userId: wx.getStorageSync('id'),
        money: money,
        type: '支付宝',
        code: num,
      },
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        if (res.data.code == 0) {
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000,
          })
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '请求失败',
          icon:'none',
          duration: 1000,
        })
      }
    })
  },
  getNum: function(e) { //账号
    this.setData({
      num: e.detail.value
    })
  },
  getMoeny: function(e) { //金额
    this.setData({
      money: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
     let _this = this
    wx.request({
      url: app.data.url + '/api/orderCom/getMemberCom',
      data: {
        userId: wx.getStorageSync('id'),
      },
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == 0) {
          _this.setData({
            kPrice: res.data.data.kPrice
          })
        } else {
          wx.showToast({
            title: res.data.msg,
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '请求失败',
          duration: 1000,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {
  //   return {
  //     path: '/pages/index/index?code=' + wx.getStorageSync('wxCode'),
  //     success: function (res) {
  //     },
  //   }
  // }
})