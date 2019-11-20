// pages/mineCollect/mineCollect.js
const app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodList: [],
    pageNum: 1,
    isLast: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //请求收藏列表
    that.getCollectList();
  },
  cancleCollect: function (e) {//取消收藏
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var list = that.data.goodList;
    var params = {
      userId: wx.getStorageSync('id'),
      goodsId: id
    }
    util.requestLoadingSuc(app.data.url + '/api/memberFollow/setFollow', params, '正在请求中', function (res) {
      list.splice(index, 1);
      that.setData({
        goodList: list
      })
    })
  },
  toGoodDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../xiangqing/xiangqing?id=' + id+'&type=0',
    })
  },
  getCollectList: function () { //获取收藏列表
    var that = this;
    var params = {
      userId: wx.getStorageSync('id'),
      pageNumber: that.data.pageNum,
      pageSize: '20'
    }
    var goodList = that.data.goodList;
    util.requestLoadingSuc(app.data.url + '/api/memberFollow/getFollowList', params, '正在加载中', function (res) {
      if (that.data.pageNum == 1) {
        goodList = [];
      }
      goodList = goodList.concat(res.data.data.list)
      that.setData({
        goodList: goodList,
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
    var that = this;
    that.setData({
      pageNumber:1
    })
    that.getCollectList();
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
      that.getCollectList();
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