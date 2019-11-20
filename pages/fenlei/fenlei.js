// pages/fenlei/fenlei.js
const app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toView: '', //显示的分类Id
    navActive: 0, //显示分类的索引
    category: [],
    goodList: [],
    pageNum: 1,
    isLast: false,
    classId:'',
    scroll_height:603
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var index = wx.getStorageSync('cateIdx')
    var res = wx.getSystemInfoSync();
    var height = res.windowHeight - 71;
    // that.setData({
    //   scroll_height: height
    // })
    var query = wx.createSelectorQuery();
    //获取按钮上方视图的高度
    query.select('#itemRight').boundingClientRect()
    query.exec(function (res) {
      //res就是 所有标签为mjltest的元素的信息 的数组
      console.log(res);
      //取高度
      console.log(res[0].height);
      that.setData({
        scroll_height: res[0].height-40,
      })
    })
    
    //请求分类数据
    wx.request({
      url: getApp().data.url + '/api/goods/class/list',
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "POST",
      data: {

      },
      success(res) {
        console.log('分类', res)
        if (res.data.code == 0) {
          that.setData({
            category: res.data.data
          })
          if (res.data.data.length > 0) {
            // that.setData({
            //   navActive: 0,
            //   toView: res.data.data[0].id,
            //   classId: res.data.data[0].id
            // })
            // that.getList();
            if (index == -1) {//显示海外直购分类
              that.setData({
                toView: that.data.category[that.data.category.length - 1].id,
                navActive: that.data.category.length - 1,
                classId: that.data.category[that.data.category.length - 1].id,
                pageNum: 1
              });
            } else {
              wx.setStorageSync('cateIdx', 0)
              that.setData({
                toView: that.data.category[0].id,
                navActive: 0,
                classId: that.data.category[0].id,
                pageNum: 1
              });
            }
            that.getList();
          }
          // wx.request({
          //   url: getApp().data.url + '/api/goods/smallClassList',
          //   data: {
          //     parentId: res.data.data[0].id,
          //     pageNumber: 1,
          //     pageSize: 40
          //   },
          //   method: 'post',
          //   header: {
          //     'content-type': 'application/json' // 默认值
          //   },
          //   success: function (res) {
          //     console.log(res)
          //     _this.setData({
          //       detail: res.data.data.list
          //     })
          //   },
          //   fail: function (data) {
          //   }
          // })
        } else {
          wx.showToast({
            title: res.data.msg,
            duration: 2000,
            icon: 'none'
          })
        }
      }
    })
  },
  list: function (e) {
    var id = e.currentTarget.dataset.id;
    // wx.navigateTo({
    //   url: '../flList/flList?id=' + id,
    // })
    wx.navigateTo({
      url: '/pages/xiangqing/xiangqing?id=' + id,
    })
  },
  search: function() { //搜索
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  tap: function(e) { //点击一级分类
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    wx.setStorageSync('cateIdx', index)
    that.setData({
      toView: id,
      navActive: index,
      classId:id,
      pageNum:1
    });
    that.getList();
    // wx.request({
    //   url: getApp().data.url + '/api/goods/smallClassList',
    //   data: {
    //     parentId: id,
    //     pageNumber: 1,
    //     pageSize: 40
    //   },
    //   method: 'post',
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function(res) {
    //     console.log(res)
    //     that.setData({
    //       detail: res.data.data.list
    //     })
    //   },
    //   fail: function(data) {
    //   }
    // })
  },
  getList: function () { //获取商品列表
    var that = this;
    var params = {
      userId: wx.getStorageSync('id'),
      classId: that.data.classId,
      order:'',
      method:'desc',
      pageNumber: that.data.pageNum,
      pageSize: '20'
    }
    var goodList = that.data.goodList;
    util.requestLoadingSuc(app.data.url + '/api/goods/goodsListByClass', params, '正在加载中', function (res) {
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
  loadMore:function(){//加载更多商品
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    var index = wx.getStorageSync('cateIdx')
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
    
    if (that.data.category.length > 0) {
      if (index == -1) {//显示海外直购分类
        that.setData({
          toView: that.data.category[that.data.category.length - 1].id,
          navActive: that.data.category.length - 1,
          classId: that.data.category[that.data.category.length - 1].id,
          pageNum: 1
        });
      } else {
        that.setData({
          toView: that.data.category[index].id,
          navActive: index,
          classId: that.data.category[index].id,
          pageNum: 1
        });
      }
      that.getList();
    }
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
    //请求分类数据
    wx.request({
      url: getApp().data.url + '/api/goods/class/list',
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "POST",
      data: {

      },
      success(res) {
        console.log('分类', res)
        if (res.data.code == 0) {
          that.setData({
            category: res.data.data
          })
          if (res.data.data.length > 0) {
              wx.setStorageSync('cateIdx', 0)
              that.setData({
                toView: that.data.category[0].id,
                navActive: 0,
                classId: that.data.category[0].id,
                pageNum: 1
              });
            }
            that.getList();
        } else {
          wx.showToast({
            title: res.data.msg,
            duration: 2000,
            icon: 'none'
          })
        }
      }
    })
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
  // onShareAppMessage: function() {
  //   return {
  //     path: '/pages/index/index?code=' + wx.getStorageSync('wxCode'),
  //     success: function (res) {
  //     },
  //   }
  // }
})