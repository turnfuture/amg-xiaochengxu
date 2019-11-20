// pages/set/set.js
const app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //请求用户信息
    util.requestLoadingSuc(app.data.url + '/api/member/getMemberCenter', {
      userId: wx.getStorageSync('id')
    },'正在加载中', function (res) {
      that.setData({
        userInfo: res.data.map
      })
    })
  },
  toAccount: function (e) {//跳转到账户余额
    let kPrice = this.data.kPrice
    wx: wx.navigateTo({
      url: '/pages/fenhong/fenhong?money=' + this.data.userInfo.allPrice
    })
  },
  toMineIncome: function (e) {//跳转到我的积分
    wx.navigateTo({
      url: '/pages/mineIncome/mineIncome?integ=' + this.data.userInfo.scoreNum,
    })
  },
  toCoupon: function (e) {//跳转到优惠券
    wx.navigateTo({
      url: '/pages/youhui/youhui',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //   return {
  //     path: '/pages/index/index?code=' + wx.getStorageSync('wxCode'),
  //     success: function (res) {
  //     },
  //   }
  // }
})