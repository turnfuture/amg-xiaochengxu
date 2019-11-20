// pages/shopCar/shopCar.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_edit: true,
    list: [], // 购物车列表
    hasList: 0, // 列表是否有数据
    // 金额
    totalPrice: 0,
    
    selectAllStatus: false,
    bool: true,
    showNum: [],
    carText: true,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
  }, //进入商品详情
  good: function(e) {
    let id = encodeURIComponent(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../../pages/xiangqing/xiangqing?id=' + id
    })
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    var that = this;
    // 获取选中的radio索引
    var index = e.currentTarget.dataset.index;
    // 获取到商品列表数据
    var list = that.data.list;
    // 默认全选
    that.data.selectAllStatus = true;
    // 循环数组数据，判断----选中/未选中[selected]
    list[index].selected = !list[index].selected;
    // 如果数组数据全部为selected[true],全选
    for (var i = list.length - 1; i >= 0; i--) {
      if (!list[i].selected) {
        that.data.selectAllStatus = false;
        break;
      }
    }
    // 重新渲染数据
    that.setData({
      list: list,
      selectAllStatus: that.data.selectAllStatus
    })
    // 调用计算金额方法
    that.count_price();
  },
  /**
   * 购物车全选事件
   */
  selectAll(e) {
    // 全选ICON默认选中
    let selectAllStatus = this.data.selectAllStatus;
    // true  -----   false
    selectAllStatus = !selectAllStatus;
    // 获取商品数据
    let list = this.data.list;
    // 循环遍历判断列表中的数据是否选中
    for (let i = 0; i < list.length; i++) {
      list[i].selected = selectAllStatus;
    }
    // 页面重新渲染
    this.setData({
      selectAllStatus: selectAllStatus,
      list: list
    });
    // 计算金额方法
    this.count_price();
  },
  /**
   * 绑定加数量事件
   */
  btn_add(e) {
    let that = this;
    const index = e.currentTarget.dataset.index;
    let list = that.data.list;
    let num = list[index].num;
    num = num + 1;
    list[index].num = num;
    wx.request({
      url: getApp().data.url + '/api/memberCart/editCart',
      // data: { cartId: cartId, memberId: memberId.id, num:num},
      data: {
        userId: wx.getStorageSync('id'),
        cartId: list[index].id,
        num: num,
      },
      method: 'post',
      success: function(res) {
        if (res.data.code == 0) {
          that.setData({
            list: list
          });
          // 计算金额方法
          that.count_price();
        } else {
          wx.showToast({
            title: res.data.msg,
            duration: 2000
          })
        }
      }
    })
  },
  /**
   * 绑定减数量事件
   */
  btn_minus(e) {
    let that = this;
    const index = e.currentTarget.dataset.index;
    let list = this.data.list;
    let num = list[index].num;

    // 判断num小于等于1  return; 
    if (num <= 1) {
      wx.showModal({
        title: '购物数量最小为1',
      })
      return false;
    }
    num = num - 1;
    list[index].num = num;
    wx.request({
      url: getApp().data.url + '/api/memberCart/editCart',
      data: {
        userId: wx.getStorageSync('id'),
        cartId: list[index].id,
        num: num,
      },
      method: 'post',
      success: function(res) {
        if (res.data.code == 0) {
          that.setData({
            list: list
          });
          // 计算金额方法
          that.count_price();
        }
      }
    })
  },

  /**
   * 计算总价
   */
  count_price() {
    // 获取商品列表数据
    let list = this.data.list;
    // 声明一个变量接收数组列表price
    let total = 0;
    // 循环列表得到每个数据
    for (let i = 0; i < list.length; i++) {
      // 判断选中计算价格
      if (list[i].selected) {
        // 所有价格加起来 count_money
        total += list[i].num * list[i].price;
      }
    }
    // 最后赋值到data中渲染到页面
    this.setData({
      totalPrice: total
    });
  }, // 编辑
  btn_edit: function() {
    var that = this;
    if (that.data.bool) {
      that.setData({
        show_edit: false
      })
      that.data.bool = false;
    } else {
      that.setData({
        show_edit: true
      })
      that.data.bool = true;
    }
  },
  // 删除购物车商品
  delOrder: function(e) {
    let that = this;
    let list = this.data.list;
    // 声明一个变量接收数组列表price
    let total = 0;
    // 循环列表得到每个数据
    let cartList = [];
    for (let i = 0; i < list.length; i++) {
      // 判断选中计算价格
      if (list[i].selected) {
        cartList.push(list[i].id);
      }
    }
    if (cartList.length==0){
      wx.showToast({
        title: '您还未选中商品',
        icon:'none',
        duration:2000
      })
      return;
    }
    wx.showModal({
      title: '',
      content: '您确定要删除商品么？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: getApp().data.url + '/api/memberCart/cartRemove',
            data: {
              userId: wx.getStorageSync('id'),
              cartList: cartList
            },
            method: 'post',
            success: function (res) {
              if (res.data.code == 0) {
                wx.request({
                  url: getApp().data.url + '/api/memberCart/getList',
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  method: "POST",
                  data: {
                    userId: wx.getStorageSync('id'),
                    pageNum: '1',
                    pageSize: '10',
                  },
                  success: function (res) {
                    var data = res.data.data;
                    for (let i = 0; i < data.length; i++) {
                      data[i].selected = false;
                    }
                    if (data.length <= 0) {
                      that.setData({
                        hasList: 1
                      })
                    }
                    that.setData({
                      list: data,
                      selectAllStatus: false
                    })
                    // 价格方法
                    that.count_price();
                  },
                  fail(res) {
                    wx.showToast({
                      title: '请求失败',
                      duration: 2000
                    });
                    _this.setData({
                      fail: true,
                    })

                  }
                })
              } else {
                wx.showToast({
                  title: res.data.msg,
                  duration: 2000
                })
              }

            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }, 
  
  // 提交订单
  btn_submit_order: function() {
    var that = this;
    let list = this.data.list;
    let cartList = [];
    for (let i = 0; i < list.length; i++) {
      // 判断选中
      if (list[i].selected) {
        cartList.push(list[i].id)
      }
    }
    if (cartList.length <= 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'success',
        duration: 2000
      })
    } else {
      wx.setStorageSync('cartOrder', cartList)
      var showNum = wx.getStorageSync('cartOrder')
      wx.navigateTo({
        url: '../../pages/order/order',
      })
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
    let _this = this
    getApp().loaDing();
    wx.request({
      url: getApp().data.url + '/api/memberCart/getList',
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "POST",
      data: {
        userId: wx.getStorageSync('id'),
        pageNum: '1',
        pageSize: '10',
      },
      success(res) {
        if (res.data.code==0) {
          var data = res.data.data;
          for (let i = 0; i < data.length; i++) {
            data[i].selected = false;
          }
          _this.setData({
            hasList: 0,
            list: res.data.data,
            selectAllStatus: false,
            show_edit: true
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: '请求失败',
          duration: 2000
        });
        _this.setData({
          fail: true,
        })

      }
    })
    wx.hideLoading();
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
  //   return {
  //     path: '/pages/index/index?code=' + wx.getStorageSync('wxCode'),
  //     success: function (res) {
  //     },
  //   }
  // }
})