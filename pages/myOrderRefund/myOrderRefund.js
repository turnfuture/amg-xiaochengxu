// pages/myOrderRefund/myOrderRefund.js
// pages/order/order.js
//获取应用实例
Page({
  /**
   * 页面的初始数据
   */
  data: {
    alreadyOrder: [],
    hasNextPage: false,
    pageNumber: 1,
    hasList: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 页面渲染完成
    // this.getDeviceInfo()
    // this.orderShow()
  },
  orderShow: function () {
    let that = this;
    that.setData({
      pageNumber: 1
    })
    that.getOrderList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.setData({
      pageNumber: 1
    })
    that.getOrderList();
  },
  getOrderList: function () { //获取订单列表
    var that = this;
    console.log("pageNum", that.data.pageNumber)
    wx.request({
      url: getApp().data.url + '/api/order/getOrderList',
      data: {
        userId: wx.getStorageSync('id'),
        type: '5',
        pageNum: that.data.pageNumber,
        pageSize: '20',
      },
      method: 'post',
      success: function (res) {
        console.log("res", res)
        if (res.data.code == 0) {
          var alreadyOrder = that.data.alreadyOrder;
          if (that.data.pageNumber == 1) {
            alreadyOrder = [];
          }
          alreadyOrder = alreadyOrder.concat(res.data.data.list)
          that.setData({
            alreadyOrder: alreadyOrder,
            hasNextPage: res.data.data.hasNextPage
          })
        }
      }
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
    // wx.reLaunch({
    //   url: '../perSoner/perSoner'
    // })
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
    let that = this;
    let hasNextPage = that.data.hasNextPage;
    let pageNumber = that.data.pageNumber + 1;
    if (hasNextPage) {
      that.setData({
        pageNumber: pageNumber
      })
      that.getOrderList();
    }
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
  // },

  // 取消订单
  delOrder: function (e) {
    let that = this;
    let orderId = e.currentTarget.dataset.id;
    //let memberId = wx.getStorageSync('userInfo');
    let index = e.currentTarget.dataset.index;
    let alreadyOrder = that.data.alreadyOrder;
    wx.showModal({
      title: '',
      content: '您确认要取消此订单?',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: getApp().data.url + '/api/order/setStatusOrder',
            data: {
              userId: wx.getStorageSync('id'),
              orderId: orderId,
              type: '8',
            },
            method: 'post',
            success: function (res) {
              if (res.data.code == 0) {
                that.orderShow();
                wx.showToast({
                  title: res.data.msg,
                })

              }
            }
          })
        } else if (res.cancel) { }
      }
    })
  },
  reMove: function (e) { //删除订单
    let that = this;
    let orderId = e.currentTarget.dataset.id;
    //let memberId = wx.getStorageSync('userInfo');
    let index = e.currentTarget.dataset.index;
    let alreadyOrder = that.data.alreadyOrder;
    wx.showModal({
      title: '',
      content: '是否确认删除此订单么？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: getApp().data.url + '/api/order/removeOrder',
            data: {
              userId: wx.getStorageSync('id'),
              orderIdList: [{
                orderId: orderId
              }],
            },
            method: 'post',
            success: function (res) {
              alreadyOrder.splice(index, 1);
              that.setData({
                alreadyOrder: alreadyOrder,

              })
              if (res.data.code == 0) {
                wx.showToast({
                  title: res.data.msg,
                })

              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  // 退货
  returnGood: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../pages/retuGoods/retuGoods?id=' + id,
    })
  },
  logistics: function (e) { //查看物流
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../pages/wuliu/wuliu?id=' + id,
    })

  },
  receiving: function (e) { //确认收货
    let that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '',
      content: '您确认已经收到商品了么?',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: getApp().data.url + '/api/order/setStatusOrder',
            data: {
              userId: wx.getStorageSync('id'),
              orderId: id,
              type: '7',
            },
            method: 'post',
            success: function (res) {
              if (res.data.code == 0) {
                that.orderShow();
                wx.showToast({
                  title: res.data.msg,
                })

              }
            }
          })
        } else if (res.cancel) { }
      }
    })
  },
  toPay: function (e) { //去支付
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    let status = _this.data.currtab;
    let pageSize = 10;
    let pageNumber = 1;
    wx.request({
      url: getApp().data.url + '/api/wxPay/pay',
      data: {
        userId: wx.getStorageSync('id'),
        orderId: id,
        platform: 1
      },
      method: 'post',
      success: function (res) {
        if (res.data.code == 0) {
          let payInfo = res.data.data
          _this.setData({
            timeStamp: payInfo.timeStamp,
            nonceStr: payInfo.nonceStr,
            package: payInfo.prepayId,
            paySign: payInfo.sign,
            appId: payInfo.appId,
          })
          wx.requestPayment({
            timeStamp: _this.data.timeStamp,
            nonceStr: _this.data.nonceStr,
            package: _this.data.package,
            signType: 'MD5',
            paySign: _this.data.paySign,
            success(res) {
              wx.navigateTo({
                url: '/pages/perSoner/perSoner',
              })
            },
            fail(res) { }
          })

        }
      }
    })
  },
  orderDetails: function (e) { //详情
    // let id = e.currentTarget.dataset.id;
    // wx.navigateTo({
    //   url: '../../pages/orderxq/orderxq?id=' + id + '',
    // })
  },
  // 去评价
  goComment: function (e) {
    let productId = e.currentTarget.dataset.goodid;
    let orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../pages/evaluationGood/evaluationGood?id=' + orderId
    })
  },
  onPullDownRefresh: function () {
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    var that = this;
    that.setData({
      pageNumber: 1
    })
    that.getOrderList();
    // 隐藏导航栏加载框  
    wx.hideNavigationBarLoading();
    // 停止下拉动作  
    wx.stopPullDownRefresh();

  }
})