// pages/myOrderInteg/myOrderInteg.js
//获取应用实例
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currtab: 0,
    swipertab: [{
      name: '全部',
      index: 0
    }, {
      name: '待发货',
      index: 1
    }, {
      name: '兑换成功',
      index: 2
    }, {
      name: '兑换失败',
      index: 3
    }],
    alreadyOrder: [],
    hasNextPage: false,
    pageNumber: 1,
    hasList: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  /**
   * @Explain：选项卡点击切换
   */
  tabSwitch: function (e) {
    var that = this
    if (that.data.currtab === e.target.dataset.current) {
      return false
    } else {
      that.setData({
        currtab: e.target.dataset.current
      })
      that.orderShow()
    }
  },

  orderShow: function () {
    let that = this;
    that.setData({
      pageNumber: 1
    })
    that.getOrderList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.setData({
      pageNumber: 1
    })
    that.getOrderList();
  },
  getOrderList: function () { //获取订单列表
    var that = this;
    console.log("pageNum", that.data.pageNumber)
    var currtab = that.data.currtab;
    wx.request({
      url: getApp().data.url + '/api/score/getOrderList',
      data: {
        userId: wx.getStorageSync('id'),
        status: currtab==0?'':currtab==1?'0':currtab==2?'1':'2',
        pageNumber: that.data.pageNumber,
        pageSize: '20',
      },
      method: 'post',
      success: function (res) {
        console.log("res", res)
        if (res.data.code == 0) {
          var alreadyOrder = that.data.alreadyOrder;
          if (that.data.pageNumber == 1) {
            alreadyOrder = [];
          }
          alreadyOrder = alreadyOrder.concat(res.data.data.list)
          that.setData({
            alreadyOrder: alreadyOrder,
            hasNextPage: res.data.data.hasNextPage
          })
        }
      }
    })
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
    // wx.reLaunch({
    //   url: '../perSoner/perSoner'
    // })
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
    let that = this;
    let hasNextPage = that.data.hasNextPage;
    let pageNumber = that.data.pageNumber + 1;
    if (hasNextPage) {
      that.setData({
        pageNumber: pageNumber
      })
      that.getOrderList();
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
  // },
  orderDetails: function (e) { //详情
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../pages/orderxqInteg/orderxqInteg?id=' + id + '',
    })
  },
  onPullDownRefresh: function () {
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    var that = this;
    that.setData({
      pageNumber: 1
    })
    that.getOrderList();
    // 隐藏导航栏加载框  
    wx.hideNavigationBarLoading();
    // 停止下拉动作  
    wx.stopPullDownRefresh();

  }
})