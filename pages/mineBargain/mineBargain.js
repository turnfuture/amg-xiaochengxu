// pages/mineBargain/mineBargain.js
const app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adverImg:'',//顶部广告图
    list: null,
    pageNum: 1,
    isLast: false,
    countDownList: [],//倒计时数组
    actEndTimeList: []//限时秒杀结束时间数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //请求广告图
    util.requestLoadingSuc(app.data.url + '/api/cms/slide/list', {type:4}, '正在加载中', function (res) {
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
      url: '/pages/mineBarginDetail/mineBarginDetail?id='+id,
    })
  },
  toPay: function (e) {//去支付
  var that = this;
    var id = e.currentTarget.dataset.id;
    wx.request({
      url: getApp().data.url + '/api/wxPay/pay',
      data: {
        userId: wx.getStorageSync('id'),
        orderId: id,
        platform: 1
      },
      method: 'post',
      success: function (res) {
        if (res.data.code == 0) {
          let payInfo = res.data.data
          wx.requestPayment({
            timeStamp: payInfo.timeStamp,
            nonceStr: payInfo.nonceStr,
            package: payInfo.prepayId,
            signType: 'MD5',
            paySign: payInfo.sign,
            success(res) {
              wx.showToast({
                title: '支付成功，可到待发货中查看',
                icon:'none',
                duration:2000
              })
              that.setData({
                pageNum:1
              })
              that.getList();
            },
            fail(res) { }
          })

        }
      }
    })
  },
  continueBargain: function (e) {//继续砍价
    var that = this;
    var list = that.data.list;
    var index = e.currentTarget.dataset.index;
    var nowTime = new Date().getTime();
    var endTime = list[index].end_at;
    if (nowTime>=endTime){//时间已过期
      wx.showToast({
        title: '时间已到期，无法继续砍价',
        icon:'none',
        duration:2000
      })
    }else{
      wx.navigateTo({
        url: '/pages/mineBarginDetail/mineBarginDetail?id=' + list[index].bargainOrderId,
      })
    }
  },
  getList: function () { //获取列表
    var that = this;
    var params = {
      userId:wx.getStorageSync('id'),
      pageNumber: that.data.pageNum,
      pageSize: '20'
    }
    var list = that.data.list;
    util.requestLoadingSuc(app.data.url + '/api/goodsBargain/getOrderBargainList', params, '正在加载中', function (res) {
      //res就是我们请求接口返回的数据
      if (that.data.pageNum == 1) {
        list = [];
      }
      list = list.concat(res.data.data.list);
      let actEndTimeList = [];
      // 将活动的结束时间参数提成一个单独的数组，方便操作
      list.forEach(o => { actEndTimeList.push(o.end_at) })
      that.setData({
        list: list,
        isLast: res.data.data.hasNextPage,
        actEndTimeList: actEndTimeList
      });
      // 执行倒计时函数
      that.countDown();
    })
  },
  timeFormat(param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  countDown() {//倒计时函数
    var that = this;
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let endTimeList = that.data.actEndTimeList;
    let countDownArr = [];

    // 对结束时间进行处理渲染到页面
    endTimeList.forEach(o => {
      let endTime = new Date(o.replace(/-/g, "/")).getTime();
      let obj = null;
      // 如果活动未结束，对时间进行处理
      if (endTime - newTime > 0) {
        let time = (endTime - newTime) / 1000;
        // 获取天、时、分、秒
        let day = parseInt(time / (60 * 60 * 24));
        let hou = parseInt(time % (60 * 60 * 24) / 3600);
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        if(day>0){
          hou = hou * day;
        }
        obj = {
          // day: that.timeFormat(day),
          hou: that.timeFormat(hou),
          min: that.timeFormat(min),
          sec: that.timeFormat(sec)
        }
      } else {//活动已结束，全部设置为'00'
        obj = {
          day: '00',
          hou: '00',
          min: '00',
          sec: '00'
        }
      }
      countDownArr.push(obj);
    })
    // 渲染，然后每隔一秒执行一次倒计时函数
    that.setData({ countDownList: countDownArr })
    setTimeout(that.countDown, 1000);
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
    this.setData({
      pageNum: 1
    });
    this.getList();
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