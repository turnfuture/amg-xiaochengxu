// pages/mineBarginDetail/mineBarginDetail.js
const app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    detail: {},
    progress: 0, //砍价进度
    countDown: {}, //倒计时
    actEndTime: '',//结束时间
    isFinish:false//倒计时是否结束
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id;
    var that = this;
    that.setData({
      id: id
    });
    that.getData();
  },
  getData:function(){//获取页面信息
    var that = this;
    //请求数据
    util.requestLoadingSuc(app.data.url + '/api/goodsBargain/getOrderBargainById', {
      bargainOrderId: that.data.id
    }, '正在加载中', function (res) {
      var progress = (res.data.data.havePrice / (res.data.data.havePrice + res.data.data.needPrice)) * 100;
      that.setData({
        detail: res.data.data,
        progress: progress,
        actEndTime: res.data.data.end_at
      });
      // 执行倒计时函数
      that.countDown();
    })
  },
  toShare:function(e){//去分享

  },
  timeFormat(param) { //小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  countDown() { //倒计时函数
    var that = this;
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let endDate = that.data.actEndTime;
    let countDownArr = {};

    // 对结束时间进行处理渲染到页面

    let endTime = new Date(endDate).getTime();
    let obj = null;
    // 如果活动未结束，对时间进行处理
    if (endTime - newTime > 0) {
      let time = (endTime - newTime) / 1000;
      // 获取天、时、分、秒
      let day = parseInt(time / (60 * 60 * 24));
      let hou = parseInt(time % (60 * 60 * 24) / 3600);
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
      if (day > 0) {
        hou = hou * day;
      }
      obj = {
        // day: that.timeFormat(day),
        hou: that.timeFormat(hou),
        min: that.timeFormat(min),
        sec: that.timeFormat(sec)
      }
    } else { //活动已结束，全部设置为'00'
      that.setData({
        isFinish:true
      })
      obj = {
        day: '00',
        hou: '00',
        min: '00',
        sec: '00'
      }
    }
    countDownArr = obj;

    // 渲染，然后每隔一秒执行一次倒计时函数
    that.setData({
      countDown: countDownArr
    })
    if (!that.data.isFinish){
      setTimeout(that.countDown, 1000);
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
    var that = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    that.getData();
    wx.hideNavigationBarLoading()//在标题栏中隐藏加载
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this;
    if (res.from === 'button') {
    }

    return {
      title: '转发',
      path: '/pages/mineBarginShare/mineBarginShare?id=' + that.data.id + '&code=' + that.data.detail.InvitationCode,
      success: function (res) {
        console.log('成功', res)
      }
    }
  }
})