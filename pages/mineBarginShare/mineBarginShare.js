// pages/mineBarginShare/mineBarginShare.js
const app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    code: '',
    detail: {},
    progress: 0, //砍价进度
    countDown: {}, //倒计时
    actEndTime: '', //结束时间
    isFinish: false //倒计时是否结束
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id;
    var code = options.code;
    var that = this;
    that.setData({
      id: id,
      code: code
    })
    that.getDetail();
    if (!wx.getStorageSync('id')) {
      wx.navigateTo({
        url: '/pages/authorize/authorize?code=' + code,
      })
    }
  },
  toBargin: function(e) { //砍价
    var that = this;
    if (that.data.isFinish) { //砍价活动已结束
      wx.showToast({
        title: '砍价已结束',
        icon: 'none',
        duration: 2000
      })
    } else {
      util.requestLoadingSuc(app.data.url + '/api/goodsBargain/helpBargain', {
        bargainOrderId: that.data.id,
        userId: wx.getStorageSync('id')
      }, '正在砍价中', function(res) {
        that.getDetail();
        wx.showToast({
          title: '你已成功砍价' + res.data.data.minePrice + '元',
          icon: 'none',
          duration: 2000
        })
      })
    }
  },
  getDetail: function() { //获取页面数据
    var that = this;
    //请求数据
    util.requestLoadingSuc(app.data.url + '/api/goodsBargain/getOrderBargainById', {
      bargainOrderId: that.data.id
    }, '正在加载中', function(res) {
      var progress = (res.data.data.havePrice / (res.data.data.havePrice + res.data.data.needPrice))*100;
      console.log('progress', progress)
      that.setData({
        detail: res.data.data,
        progress: progress,
        actEndTime: res.data.data.end_at
      });
      // 执行倒计时函数
      that.countDown();
    })
  },
  timeFormat(param) { //小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  countDown() { //倒计时函数
    var that = this;
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let endDate = that.data.actEndTime;
    // console.log('endTime', that.data.actEndTime)
    let countDownArr = {};
    // 对结束时间进行处理渲染到页面
    let endTime = new Date(endDate.replace(/-/g, "/")).getTime();
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
      console.log('hou----' + hou + '----min------' + min + '---sec----' + sec + '-----day-----' + day)

      obj = {
        // day: that.timeFormat(day),
        hou: that.timeFormat(hou),
        min: that.timeFormat(min),
        sec: that.timeFormat(sec)
      }
    } else { //活动已结束，全部设置为'00'
      that.setData({
        isFinish: true
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
    if (!that.data.isFinish) {
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})