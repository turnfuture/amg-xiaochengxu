// pages/bargainList/bargainList.js
const app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adverImg: '',//顶部广告图
    list: [],
    pageNum: 1,
    isLast: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //请求广告图
    util.requestLoadingSuc(app.data.url + '/api/cms/slide/list', { type: 4 }, '正在加载中', function (res) {
      //res就是我们请求接口返回的数据
      that.setData({
        adverImg: res.data.data[0].imgUrl
      });
    })
    that.getList();
  },
  toDetail: function (e) {//跳转到详情页面
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/xiangqing/xiangqing?id=' + id+'&type=3',
    })
  },
  getList: function () { //获取列表
    var that = this;
    var params = {
      pageNumber: that.data.pageNum,
      pageSize: '20'
    }
    var list = that.data.list;
    util.requestLoadingSuc(app.data.url + '/api/goodsBargain/getBargainGoodsList', params, '正在加载中', function (res) {
      if (that.data.pageNum == 1) {
        list = [];
      }
      list = list.concat(res.data.data.list);
      that.setData({
        list: list,
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
      that.getList();
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