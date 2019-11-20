// pages/mineMsg/mineMsg.js
const app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgList: [],
    pageNum: 1,
    isLast: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //请求收藏列表
    that.getMsgList();
  },
  toDetail: function (e) {//跳转到详情页面
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/mineMsgDetail/mineMsgDetail?id=' + id
    })
  },
  getMsgList: function () { //获取消息列表
    var that = this;
    var params = {
      pageNumber: that.data.pageNum,
      pageSize: '20'
    }
    var msgList = that.data.msgList;
    util.requestLoadingSuc(app.data.url + '/api/cms/noticeSys/list', params, '正在加载中', function (res) {
      //res就是我们请求接口返回的数据
      if (that.data.pageNum == 1) {
        msgList = [];
      }
      msgList = msgList.concat(res.data.data.list)
      that.setData({
        msgList: msgList,
        isLast: res.data.data.hasNextPage
      });
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
    const that = this;
    if (that.data.isLast) {
      var pageNum = that.data.pageNum + 1;
      that.setData({
        pageNum: pageNum
      });
      that.getMsgList();
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
  // }
})