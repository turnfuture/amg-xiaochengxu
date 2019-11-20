// pages/orderxqInteg/orderxqInteg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetails: '',
    couponMoney: 0,
    orderId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let orderId = options.id;
    that.setData({
      orderId: orderId
    })
    wx.request({
      url: getApp().data.url + '/api/score/getOrderById',
      data: {
        userId: wx.getStorageSync('id'),
        scoreOrderId: orderId,
      },
      method: 'post',
      success: function (res) {
        console.log(res)
        that.setData({
          orderDetails: res.data.data,
        })
      }
    })
  }, // 删除订单
  delOrder: function (e) {
    let that = this;
    let orderId = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let alreadyOrder = that.data.alreadyOrder;
    wx.showModal({
      title: '提示',
      content: '是否确认删除此订单',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: getApp().data.url + '/api/order/removeOrder',
            data: {
              userId: wx.getStorageSync('id'),
              orderId: orderId
            },
            method: 'post',
            success: function (res) {
              alreadyOrder.list.splice(index, 1);
              that.setData({
                alreadyOrder: alreadyOrder
              })
              if (res.data.code == 0) {
                wx.showToast({
                  title: res.data.msg,
                })
              }
            }
          })
        } else if (res.cancel) {
        }
      }
    })
  },
  returnGood: function (e) { //去退货
    let that = this;
    //let memberId = wx.getStorageSync('userInfo');
    let orderId = that.data.orderId;
    wx.navigateTo({
      url: '../../pages/retuGoods/retuGoods?orderId=' + orderId,


    })


  },
  logistics: function (e) { //查看物流
    let _this = this
    let orderId = _this.data.orderId;
    wx.navigateTo({
      url: '../../pages/wuliu/wuliu?orderId=' + orderId,
    })
  },
  receiving: function () { //确认收货
    let _this = this
    let orderId = _this.data.orderId;
    wx.request({
      url: getApp().data.url + '/api/order/setStatusOrder',
      data: {
        userId: wx.getStorageSync('id'),
        orderId: orderId,
        type: 7,
      },
      method: 'post',
      success: function (res) {
        if (res.data.code == 0) {
          wx: wx.showToast({
            title: '退货成功',
            duration: 1000,
          })
          wx.navigateBack({
            delta: 1
          })
        }
        else {
          wx: wx.showToast({
            title: res.data.msg,
            duration: 1000,
          })
        }
      }
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