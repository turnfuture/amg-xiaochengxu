// pages/addAress/addAress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switch: 0,
    region: ['', '', ''],
    addressId: '',
    iseDit: '', //判断是否是编辑地址进页面
    addRess: '', //判断是否是新建地址进页面
    isAdd: '', //判断是否是新建地址进页面
    userName: '',
    phone: '',
    detail: '',

  },
  bindRegionChange: function(e) { //地址
    this.setData({
      region: e.detail.value
    })
  },
  backAddress() { //保存编辑地址
    let _this = this;
    let addressId = _this.data.addressId;
    let elsEpro = _this.data.region[0]
    let elsEcity = _this.data.region[1]
    let elsEcoun = _this.data.region[2]
    if (!_this.data.userName) {
      wx.showToast({
        title: '请输入收货人',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let isPhone = /^1\d{10}$/
    if (!isPhone.test(_this.data.phone)) {
      wx.showToast({
        title: '请输入正确的号码',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (!elsEpro) {
      wx.showToast({
        title: '请选择地区',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (!_this.data.detail) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.request({
      url: getApp().data.url + '/api/member/address/change',
      data: {
        userId: wx.getStorageSync('id'),
        province: elsEpro,
        city: elsEcity,
        country: elsEcoun,
        address: _this.data.detail,
        fullName: _this.data.userName,
        phone: _this.data.phone,
        default: _this.data.switch,
        addressId: addressId,
      },
      method: 'post',
      success: function(res) {
        console.log(res)
        if (wx.getStorageSync('address').id===addressId){//修改了用户选择的收货地址信息
          var addressMsg = {
            id:addressId,
            province: elsEpro,
            city: elsEcity,
            county: elsEcoun,
            address: _this.data.detail,
            fullName: _this.data.userName,
            phone: _this.data.phone,
            defaultValue: _this.data.switch,
            userId:wx.getStorageSync('id')
          }
          wx.setStorageSync('address', addressMsg)
        }
        wx.showToast({
          title: '添加成功',
          duration: 2000
        })
        wx.navigateBack({
          delta: 1
        })
      },
      fail(res) {
        wx.showToast({
          title: '异常',
        })
      }
    })
  }, 
  //保存新增地址
  addRess: function(e) {
    var _this = this
    let region =  _this.data.region 
    let addSwitch  = _this.data.switch
    let detAress= _this.data.detail
    let fullName = _this.data.userName
    let phone = _this.data.phone

    if (!fullName) {
      wx.showToast({
        title: '请输入收货人',
        icon:'none',
        duration: 2000
      })
      return
    }
    let isPhone = /^1\d{10}$/
    if (!isPhone.test(phone)) {
      wx.showToast({
        title: '请输入正确的号码',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (!region[0]) {
      wx.showToast({
        title: '请选择地区',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (!detAress) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.request({
      url: getApp().data.url + '/api/member/address/add',
      data: {
        userId: wx.getStorageSync('id'),
        province: region[0],
        city: region[1],
        country: region[2],
        address: detAress,
        fullName: fullName,
        phone: phone,
        default: addSwitch,
      },
      method: 'post',
      success: function(res) {
        wx.showToast({
          title: '添加成功',
          duration: 2000
        })
        wx.navigateBack({
          delta: 1
        })

      },
      fail(res) {
        wx.showToast({
          title: res.data.msg,

        })
      }
    })

  },
  getPhone: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  getName: function(e) {
    this.setData({
      userName: e.detail.value
    })
  },

  getdetail: function(e) {
    this.setData({
      detail: e.detail.value
    })
  },
  switch2Change: function(e) {
    console.log(e)
    if (e.detail.value) {
      this.setData({
        switch: 0
      })
    } else {
      this.setData({
        switch: 1
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this
    let iseDit = options.iseDit
    let isAdd = options.isAdd
    getApp().loaDing();
    let addressId = options.id;
    if(addressId){
      _this.setData({
        addressId: addressId
      })
    }
    if (addressId && iseDit) {
      wx.request({
        url: getApp().data.url + '/api/member/address/getById',
        data: {
          userId: wx.getStorageSync('id'),
          addressId: addressId,
        },
        method: 'post',
        success: function(res) {
          let addreInfo = res.data.data;
          _this.setData({
            userName: addreInfo.fullName,
            phone: addreInfo.phone,
            detail: addreInfo.address,
            addreInfo: addreInfo,
            switch: res.data.data.defaultValue,
            region: [addreInfo.province, addreInfo.city, addreInfo.county]
          })
        },
        fail(res) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        },
      })
    } else if (isAdd) {
      _this.setData({
        addRess: true,
      })
     
    } else {
      wx.showToast({
        title: '地址不存在',
        duration: 2000,
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