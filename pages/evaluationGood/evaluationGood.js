// pages/evaluationGood/evaluationGood.js
var app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    goodList: [],
    evaluateList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    //请求订单详情接口获取商品信息
    util.requestLoadingSuc(app.data.url + '/api/order/getOrderById', { userId: wx.getStorageSync('id'), orderId: id }, '正在加载中', function (res) {
      that.setData({
        orderId: id,
        goodList: res.data.data.goodsList
      })
      var goodList = that.data.goodList;
      var evaluateList = [];
      for (var i = 0; i < goodList.length; i++) {
        var evaluate = {};
        evaluate.start = 5;
        evaluate.content = '';
        evaluate.imgurl = [];
        evaluate.detailId = goodList[i].detailId;
        evaluateList.push(evaluate);
      }
      that.setData({
        evaluateList: evaluateList
      })
    })

  },
  changeScore1: function (e) {//评价-1星
    var index = e.currentTarget.dataset.index;
    var evaluateList = this.data.evaluateList;
    evaluateList[index].start = 1;
    this.setData({
      evaluateList: evaluateList
    })
  },
  changeScore2: function (e) {//评价-2星
    var index = e.currentTarget.dataset.index;
    var evaluateList = this.data.evaluateList;
    evaluateList[index].start = 2;
    this.setData({
      evaluateList: evaluateList
    })
  },
  changeScore3: function (e) {//评价-3星
    var index = e.currentTarget.dataset.index;
    var evaluateList = this.data.evaluateList;
    evaluateList[index].start = 3;
    this.setData({
      evaluateList: evaluateList
    })
  },
  changeScore4: function (e) {//评价-4星
    var index = e.currentTarget.dataset.index;
    var evaluateList = this.data.evaluateList;
    evaluateList[index].start = 4;
    this.setData({
      evaluateList: evaluateList
    })
  },
  changeScore5: function (e) {//评价-5星
    var index = e.currentTarget.dataset.index;
    var evaluateList = this.data.evaluateList;
    evaluateList[index].start = 5;
    this.setData({
      evaluateList: evaluateList
    })
  },
  getEvaluateTxt: function (e) {//监听获取评价内容
    var index = e.currentTarget.dataset.index;
    var content = e.detail.value;
    var evaluateList = this.data.evaluateList;
    evaluateList[index].content = content;
    this.setData({
      evaluateList: evaluateList
    })
  },
  addPhoto: function (e) {//上传图片
    var that = this;
    var index = e.currentTarget.dataset.index;
    var evaluateList = that.data.evaluateList;
    wx.chooseImage({
      count: 6 - evaluateList[index].imgurl.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        for (var i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            url: app.data.url + '/api/common/upload',
            filePath: tempFilePaths[i],
            name: 'file',
            formData: {},
            success(res) {
              const data = JSON.parse(res.data);
              const img = data.data;
              evaluateList[index].imgurl.push(img);
              that.setData({
                evaluateList: evaluateList
              })
            }
          })
        }
      }
    })
  },
  deletePhoto: function (e) {//删除图片
    var index = e.currentTarget.dataset.index;
    var idx = e.currentTarget.dataset.idx;
    var evaluateList = this.data.evaluateList;
    evaluateList[index].imgurl.splice(idx, 1);
    this.setData({
      evaluateList: evaluateList
    })
  },
  subimt: function (e) {//提交
    var that = this;
    var evaluateList = that.data.evaluateList;
    for (var i = 0; i < evaluateList.length; i++) {
      if (evaluateList[i].content === '') {
        wx.showToast({
          title: '请输入评价内容',
          icon: 'none',
          duration: 2000
        })
        return;
      }
    }
    for (var i = 0; i < evaluateList.length; i++) {
      if (evaluateList[i].imgurl.length > 0) {
        var imgs = '';
        for (var j = 0; j < evaluateList[i].imgurl.length; j++) {
          imgs += evaluateList[i].imgurl[j] + ',';
        }
        evaluateList[i].imgurls = imgs.substring(0, imgs.length);
      } else {
        evaluateList[i].imgurls = '';
      }
    }
    util.requestLoadingSuc(app.data.url + '/api/order/setComent', { userId: wx.getStorageSync('id'), orderId: that.data.orderId, comentList: evaluateList }, '正在提交中', function (res) {
      wx.setStorageSync('orderOperate', true);
      wx.showToast({
        title: '提交成功',
        icon: 'none',
        duration: 2000
      })
      wx.navigateBack({
        delta: 1
      })
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

  // }
})