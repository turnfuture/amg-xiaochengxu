// pages/address/address.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag:0,
    addressList: [],
    defaultIndex: '',
    addresNum: true,
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    if(options.flag==1){//从个人中心跳转进入，不需要选择地址
      this.setData({
        flag:options.flag
      })
    }
  },
  selctAdress: function(e) { //选择收货地址
   
    var that = this;
    if (that.data.flag != 1) {//从确认订单页面进入，需要选择地址
      var index = e.currentTarget.dataset.index;
      var address = that.data.addressList[index];
      wx.setStorageSync('address', address);
      wx.navigateBack({
        delta: 1
      })
    }
  },
  default: function(e) { //修改i默认地址
    let that = this;
    let defaultValue = e.currentTarget.dataset.default
    let addressId = e.currentTarget.dataset.addressid;
    let index = e.currentTarget.dataset.index;
    let addressList = that.data.addressList;
    wx.request({
      url: getApp().data.url + '/api/member/address/default',
      data: {
        userId: wx.getStorageSync('id'),
        addressId: addressId,
      },
      method: 'post',
      success: function(res) {
        for (let i = 0; i < addressList.length; i++) {
          addressList[i].defaultValue = 1;
        }
        if (defaultValue == 0) {
          defaultValue = 1
        } else {
          addressList[index].defaultValue = 0
        }
        that.setData({
          addressList: addressList,
          defaultIndex: index
        })
        wx.showToast({
          title: res.data.msg,
        })
      }
    })
  },
  delAddress: function(e) { //删除地址
    let that = this;
   
    let addressId = e.currentTarget.dataset.addressid;
    let index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '是否删除该收货地址',
      success(res) {
        console.log(res)
        if (res.confirm) {
          wx.request({
            url: getApp().data.url + '/api/member/address/remove',
            data: {
              userId: wx.getStorageSync('id'),
              addressId: addressId,
            },
            method: 'post',
            success: function(res) {
              let addressList = that.data.addressList;
              addressList.splice(index, 1);
              if (addressList.length <= 0) {
                that.setData({
                  addresNum: false
                })
              }
              that.setData({
                addressList: addressList
              })
              wx.removeStorageSync('selectAdress')
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
            },
            fail(res) {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          })
        } else if (res.cancel) {
        }
      },

    })
  },
  editAddress: function(e) { //编辑收货地址
    let id = e.currentTarget.dataset.addressid;
    wx.navigateTo({
      url: '/pages/addAress/addAress?id=' + id + '&iseDit=' + '1'
    })
  },
  Address: function(e) {
    wx.navigateTo({
      url: '/pages/addAress/addAress?isAdd=' + '1'
    })
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
    getApp().loaDing()
    var that = this;
    wx.request({
      url: app.data.url + '/api/member/address/list',
      data: {
        userId: wx.getStorageSync('id')
      },
      method: 'post',
      success: function(res) {
        console.log(res)
        if (res.data.code == 0) {
            that.setData({
              addressList: res.data.data
            });
        } else {
          wx.showToast({
            title: res.data.msg,
            duration: 2000
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: "服务器异常",
          icon: 'none',
          duration: 2000
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