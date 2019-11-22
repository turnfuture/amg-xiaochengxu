// pages/fenhong/fenhong.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kPrice: 0,
    page: 1, //当前请求数据是第几页
    pageSize: 30, //每页数据条数
    hasMoreData: true, //上拉时是否继续请求数据，即是否还有更多数据

    contentlist: [],
    currentTab: 0,
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
    if (_this.data.currentTab == '0') { //可提现
      _this.moneyInfo(0, '加载中')
    } else if (_this.data.currentTab == '1') { //待结算
      _this.moneyInfo(1, '加载中')
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    getApp().loaDing();

    let _this = this
    _this.moneyInfo(0, '加载数据----')

  },
  moneyInfo: function(obj, adj) {
    let that = this;
    wx.request({
      url: app.data.url + '/api/orderCom/getMemberComList',
      data: {
        userId: wx.getStorageSync('id'),
        type: obj,
        pageSize: that.data.pageSize,
        pageNumber: that.data.page,
        platformId: 1
      },
      method: 'post',
      success: function(res) {
        if (res.data.code == 0) {
          var contentlist = that.data.contentlist;
          if (that.data.page == 1) {
            contentlist = [];
          }
          contentlist = contentlist.concat(res.data.data.list)
          that.setData({
            contentlist: contentlist,
            hasMoreData: res.data.data.hasNextPage
          });
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  tixian: function() { //跳提现记录页面
    wx: wx.navigateTo({
      url: '/pages/tixian/tixian',

    })
  },
  goPresen: function() { //去提现页面
    if (this.data.kPrice && this.data.kPrice>0){
      wx.navigateTo({
        url: '/pages/goPresen/goPresen',
      })
    }else{
      wx.showToast({
        title: '账户没有可提现余额',
        icon:'none',
        duration:2000
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let _this = this;
    _this.setData({
      page: 1
    })
    _this.getUserMsg();
    _this.moneyInfo(_this.data.currentTab, '加载中')
  },
  getUserMsg:function(){
    let _this = this;
    wx.request({
      url: app.data.url + '/api/orderCom/getMemberCom',
      data: {
        userId: wx.getStorageSync('id'),
      },
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == 0) {
          _this.setData({
            kPrice: res.data.data.kPrice
          })
        } else {
          wx.showToast({
            title: res.data.msg,
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '请求失败',
          duration: 1000,
        })
      }
    })
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    var _this = this;
    _this.setData({
      page: 1
    })
    _this.getUserMsg();
    _this.moneyInfo(_this.data.currentTab, '加载中')
    wx.hideNavigationBarLoading()//在标题栏中隐藏加载
    wx.stopPullDownRefresh();
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
      that.moneyInfo(that.data.currentTab, '加载中')
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