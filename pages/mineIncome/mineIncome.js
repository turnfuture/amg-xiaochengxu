// pages/mineIncome/mineIncome.js
const app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    income:0.00,//当前累计收益
    incomeList: [],
    pageNum:1,
    isLast:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      income: options.integ
    })
    this.getList();
  },
  getList: function () { 
    var that = this;
    var params = {
      userId: wx.getStorageSync('id'),
      type: '',
      pageNumber: that.data.pageNum,
      pageSize: '20'
    }
    var incomeList = that.data.incomeList;
    util.requestLoadingSuc(app.data.url + '/api/score/getMemberScoreList', params, '正在加载中', function (res) {
      //res就是我们请求接口返回的数据
      if (that.data.pageNum == 1) {
        incomeList = [];
      }
      incomeList = incomeList.concat(res.data.data.list)
      that.setData({
        incomeList: incomeList,
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
    console.log("加载更多------------------" + that.data.isLast)
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

  // }
})