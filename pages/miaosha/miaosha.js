// pages/miaosha/miaosha.js
const app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adverImg:'',
    active: false,
    endval: '',
    zqList: [], //专区列表
    goodsTime:[],
    timeCur: 0 ,//秒杀选中的时间段下标
    down:'',
    pageNum:1,
    isLast:false,
    timeId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let nowTime = new Date();
    console.log('現在的時間', nowTime)
    let _this = this;
    //请求广告图
    util.requestLoadingSuc(app.data.url + '/api/cms/slide/list', { type: 5 }, '正在加载中', function (res) {
      //res就是我们请求接口返回的数据
      _this.setData({
        adverImg: res.data.data[0].imgUrl
      });
    })
    //  秒杀时间段
    wx.request({
      url: getApp().data.url + '/api/goodsSpike/getTime',
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "GET",
      success(res) {
        if (res.data == '' || res.data == null) {
          wx.showToast({
            title: '没有数据',
            icon: 'none',
            duration: 2000
          })
        } else {
          console.log('时间段', res.data.data)
          var timeCur = 0;
          for (var i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].ans === "正在秒杀") {
              timeCur = i;
              _this.setData({
                timeId: res.data.data[i].timeId
              })
              _this.getGoodsByTime();
              let now = res.data.data[i].endTime
              console.log('。。。。', now)
              break;
            }
            if (res.data.data[i].ans === "即将开始") {
              timeCur = i;
              _this.setData({
                timeId: res.data.data[i].timeId
              })
              _this.getGoodsByTime();
              break;
            }
          }
          _this.setData({
            getTime: res.data.data,
            timeCur: timeCur
          })

        }
      },
      fail(res) {
        wx.showToast({
          title: '请求失败',
          icon: 'none',
          duration: 2000
        });
        _this.setData({
          fail: true,
        })

      }
    })
  }, 
  miaosha: function (e) { //秒杀商品
    let _this = this
    let timeId = e.currentTarget.dataset.timeid
    let index = e.currentTarget.dataset.index
    let aNs = e.currentTarget.dataset.aNs
    if (aNs == '已经结束') {
      return
    }
    _this.setData({
      timeCur: index,
      timeId: timeId
    })
    _this.getGoodsByTime()

  },
  getGoodsByTime: function () {
    let _this = this;
    //  秒杀时间段
    wx.request({
      url: getApp().data.url + '/api/goodsSpike/getGoodsByTime',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        timeId: _this.data.timeId,
        pageNumber: _this.data.pageNum,
        pageSize: 20,
        userId:wx.getStorageSync('id')
      },
      method: "POST",
      success(res) {
        console.log('getGoodsByTime', res)
        if (res.data == '' || res.data == null) {
          wx.showToast({
            title: '没有数据',
            icon: 'none',
            duration: 2000
          })
        } else {
          var goodsTime = _this.data.goodsTime;
          if (_this.data.pageNum == 1) {
            goodsTime = [];
          }
          goodsTime = goodsTime.concat(res.data.data.list)
          _this.setData({
            goodsTime: goodsTime,
            isLast: res.data.data.hasNextPage
          });
        }
      },
      fail(res) {
        wx.showToast({
          title: '请求失败',
          icon: 'none',
          duration: 2000
        });
        _this.setData({
          fail: true,
        })

      }
    })
  },
  msxq: function (e) { //秒杀详情
    let id = e.currentTarget.dataset.id
    wx: wx.navigateTo({
      url: '/pages/xiangqing/xiangqing?id=' + id + '&type=' + 1,
    })
  },timing:function(){
    
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
    console.log('滑动到底部-------------'+that.data.isLast)
    if (that.data.isLast) {
      var pageNum = that.data.pageNum + 1;
      that.setData({
        pageNum: pageNum
      });
      that.getGoodsByTime();
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