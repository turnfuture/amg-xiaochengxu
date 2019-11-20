// pages/mineTeam/mineTeam.js
const app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topHeight: 532,//页面顶部的高度
    totalNum:0,
    teamList:[],
    pageNum:1,
    isLast:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var res = wx.getSystemInfoSync();
    var height = res.windowHeight - 44;
    that.setData({
      topHeight: height
    })
    //请求团队列表
    that.getTeamList();
  },
  lower: function (e) {//滚动到底部，请求分页数据
    const that = this;
    console.log("加载更多------------------" + that.data.isLast)
    if (that.data.isLast) {
      var pageNum = that.data.pageNum + 1;
      that.setData({
        pageNum: pageNum
      });
      that.getTeamList();
    }
  },
  getTeamList: function () { //获取团队列表
    var that = this;
    var params = {
      userId: wx.getStorageSync('id'),
      pageNumber: that.data.pageNum,
      pageSize: '20',
      type:''
    }
    var teamList = that.data.teamList;
    util.requestLoadingSuc(app.data.url + '/api/member/getMyFans', params, '正在加载中', function (res) {
      //res就是我们请求接口返回的数据
      if (that.data.pageNum == 1) {
        teamList = [];
      }
      teamList = teamList.concat(res.data.map.list)
      that.setData({
        teamList: teamList,
        totalNum: res.data.map.total,
        isLast: res.data.map.hasNextPage
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