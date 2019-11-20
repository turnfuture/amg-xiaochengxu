// pages/tixian/tixian.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contList: [],
    hidden: true, //隐藏表单控件
    page: 1, //当前请求数据是第几页
    pageSize: 10, //每页数据条数
    hasMoreData: true, //上拉时是否继续请求数据，即是否还有更多数据
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    // this.getInfo()
    that.getInfo('正在加载数据...')
  },
  getInfo: function(message) { //今日主推
    var that = this;
    wx.showLoading({ //显示 loading 提示框
      title: message,
    })
    wx.request({
      url: app.data.url + '/api/extract/getExtractList',
      data: {
        userId: wx.getStorageSync('id'),
        pageNumber: that.data.page,
        pageSize: that.data.pageSize,
      },
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res)
        wx.hideLoading() //隐藏 loading 提示框
        if (res.data.code == 0) {
          var contentlistTem = that.data.list;
          if (that.data.page == 1) {
            contentlistTem = []
          }
          contentlistTem = contentlistTem.concat(res.data.data.list)
          that.setData({
            list: contentlistTem,
            hasMoreData: res.data.data.hasNextPage
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none',
            duration:2000
          })
        }
      },
      fail: function(res) {
      },
      complete: function(res) {},
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
    const that = this;
    if (that.data.hasMoreData) {
      var page = that.data.page + 1;
      that.setData({
        page: page
      });
      that.getInfo('加载更多数据')
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