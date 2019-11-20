// pages/youhui/youhui.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    current: 0,
    infoList: [],
    page: 1,
    hasMoreData: true
  },
  
  // 点击切换
  clickTab: function(e) {
    var _this = this;
    var current = e.target.dataset.current;
    if (_this.data.currentTab == current) {
      return false;
    }
    _this.setData({
      currentTab: current,
      page: 1
    })
    _this.used(current)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  used: function(obj) { //已使用
    let _this = this
    wx.request({
      url: app.data.url + '/api/memberCoupon/getMyCouponList',
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "POST",
      data: {
        userId: wx.getStorageSync('id'),
        type: obj,
        pageNum: 1,
        pageSize: 10,
      },
      success(res) {
        if (res.data.code == 0) {
          let infoList = _this.data.infoList;
          if (_this.data.page == 1) {
            infoList = []
          }
          infoList = infoList.concat(res.data.data.list)
          _this.setData({
            infoList: infoList,
            hasMoreData: res.data.data.hasNextPage,
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            duration: 2000
          });
        }
      },
      fail(res) {
        wx.showToast({
          title: '请求失败',
          duration: 2000
        });
        _this.setData({
          fail: true,
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
    let _this = this
    _this.used(_this.data.currentTab)
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
    const that = this;
    if (that.data.hasMoreData) {
      var page = that.data.page + 1;
      that.setData({
        page: page
      });
      that.used(_this.data.currentTab)
    }
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