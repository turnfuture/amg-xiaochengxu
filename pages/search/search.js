// pages/search/search.js
const app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKey: '', //搜索关键词
    pageNum: 1,
    isLast: false,
    goodList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  searchInput: function (e) { //监听搜索框内的文字内容
    this.setData({
      searchValue: e.detail.value
    })
  },
  searchFood: function (e) { //搜索框-点击软键盘的搜索触发
    var that = this;
    var searchValue = that.data.searchValue.trim();
    if (searchValue) {
      that.setData({
        searchKey: searchValue,
        pageNum: 1
      })
      that.getGoodList();
    } else {
      wx.showToast({
        title: '请输入商品名称',
        icon: 'none',
        duration: 2000
      })
    }
  },
  toGoodDetail: function (e) { //进入商品详情
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../xiangqing/xiangqing?id=' + id,
    })
  },

  getGoodList: function () { //获取商品列表
    var that = this;
    var params = {
      name: that.data.searchKey,
      pageNum: that.data.pageNum,
      pageSize: '20',
      userId: wx.getStorageSync('id')
    }
    var goodList = that.data.goodList;
    util.requestLoadingSuc(app.data.url + '/api/goods/findGoods', params, '正在加载中', function (res) {
      //res就是我们请求接口返回的数据
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
      that.getGoodList();
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