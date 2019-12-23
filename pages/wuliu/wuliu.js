// pages/wuliu/wuliu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderShippingDO: '',
    messageDO: '',
    expressDetailsList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this
    let orderId = options.id;
    wx.request({
      url: getApp().data.url + '/api/shopExpress/express/message',
      data: {
        userId: wx.getStorageSync('id'),
        orderId: orderId,
      },
      method: 'post',
      success: function(res) {
        console.log(res)
        if (res.data.code == 0) {
          _this.setData({
            orderShippingDO: res.data.data.orderShippingDO, //收件信息
            messageDO: res.data.data.messageDO, //物流信息
            expressDetailsList: res.data.data.messageDO.expressDetailsList
          })
        } else {
          wx: wx.showToast({
            title: res.data.msg,
            duration: 1000,
          })
        }

      },
      fail: function() {
        wx: wx.showToast({
          title: res.data.msg,
          duration: 1000,
        })
      }
    })
  },

  // 复制文案
  copy(e) {
    let order_sn = e.currentTarget.dataset.order_sn;
    wx.setClipboardData({
      data: order_sn,
      success(res) { }
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