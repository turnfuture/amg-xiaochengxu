// pages/nine/nine.js
const app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topImg:null,//顶部广告图
    pageNum: 1,
    isLast1:false,
    list1:[],
    newArr:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //请求广告图
    util.requestLoadingSuc(app.data.url + '/api/cms/slide/list', { type: 8 }, '正在加载中', function (res) {
      //res就是我们请求接口返回的数据
      that.setData({
        topImg: res.data.data[0].imgUrl
      });
    })
    
    that.getNewList()
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
    let that = this;
    if (that.data.isLast1) {
      var pageNum = that.data.pageNum + 1;
      that.setData({
        pageNum: pageNum
      });
      that.getNewList()
    }
  },
  getNewList: function() {
    const that = this;
    let newList = that.data.list1;
    getApp().loaDing();
    //新闻列表
    wx.request({
      url: getApp().data.url + '/api/goodsNine/getNineGoodsList',
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "POST",
      data: {
        pageNumber: that.data.pageNum,
        pageSize: '20',
        userId: wx.getStorageSync('id')
      },
      success(res) {
        wx.hideLoading();
        console.log(res)
        if (res.data.code == 0) {
          if (that.data.pageNum == 1) {
            newList = [];//页数为1时数组为空
          }
          let newArr = newList.concat(res.data.data.list)
          that.setData({
            list1: newArr,
            isLast1: res.data.data.hasNextPage,
          });
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail(res) {
        wx.hideLoading();
        wx.showToast({
          title: "服务器异常",
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 详情
  toDetail:function(e){
    var id= e.currentTarget.dataset.id;
        wx.navigateTo({
          url: '../../pages/xiangqing/xiangqing?id=' + id+'&type=2'
    })
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