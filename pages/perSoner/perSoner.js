// pages/perSoner/perSoner.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    perInfo:{},
    kPrice:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  toSetting: function (e) {//跳转到设置
    wx.navigateTo({
      url: '/pages/set/set',
    })
  },
  toMineIncome: function (e) {//跳转到我的积分
    wx.navigateTo({
      url: '/pages/mineIncome/mineIncome?integ=' + this.data.perInfo.scoreNum,
    })
  },
  toTodayIncome: function (e) {//跳转到今日收益
    wx: wx.navigateTo({
      url: '/pages/todayIncome/todayIncome'

    })
  },
  toAccount: function (e) {//跳转到账户余额
    let kPrice = this.data.kPrice
    wx: wx.navigateTo({
      url: '/pages/fenhong/fenhong?money=' + kPrice

    })
  },
  fenhong: function () {//跳转到可提现金额
    let kPrice = this.data.kPrice
    wx: wx.navigateTo({
      url: '/pages/fenhong/fenhong?money=' + kPrice

    })
  },
  toCoupon: function (e) {//跳转到优惠券
    wx.navigateTo({
      url: '/pages/youhui/youhui',
    })
  },
  toTeam:function(e){//跳转到我的粉丝页面
    wx.navigateTo({
      url: '/pages/mineTeam/mineTeam',
    })
  },
  toMineGroup: function (e) {//跳转到我的团购
    
  },
  toBargainDetail: function (e) {//跳转到砍价详情-无
    wx.navigateTo({
      url: '/pages/mineBargain/mineBargain',
    })
  },
  toCollect: function (e) {//跳转到收藏
    wx.navigateTo({
      url: '/pages/collEction/collEction',
    })
  },
  toMsg: function (e) {//跳转到消息-无
    wx.navigateTo({
      url: '/pages/mineMsg/mineMsg'
    })
  },
  toAddress:function(e){//跳转到地址列表
    wx.navigateTo({
      url: '/pages/address/address?flag=1',
    })
  },
  toManager:function(){//跳转到掌柜权益页面
    wx.navigateTo({
      url: '/pages/mineManage/mineManage',
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      })
    }
    let _this = this;
    wx.request({
      url: app.data.url + '/api/member/getMemberCenter',
      data: {
        userId: wx.getStorageSync('id'),
      },
      method: 'post',
      success: function (res) {
        console.log('perSoner',res)
        if (res.data.code == 0) {
           _this.setData({
             perInfo:res.data.map,
             kPrice: res.data.map.kPrice
           })

        } else {
          wx.showToast({
            title: res.data.msg,
            duration: 2000
          })
        }
      }
    })
  }, 
  myOrder: function (event) {
    var id = event.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/myOrder/myOrder?id=' + id + ''
      })
  }, 
  myOrderRefund: function () {
    wx.navigateTo({
      url: '/pages/myOrderRefund/myOrderRefund'
    })
  },
  orderIntegList: function (event) {
    wx.navigateTo({
      url: '/pages/myOrderInteg/myOrderInteg'
    })
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