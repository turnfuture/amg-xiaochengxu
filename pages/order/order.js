// pages/order/order.js
const app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {}, //收货地址
    couponShow: false,
    allPrice: '',
    coupon: '请选择优惠劵',
    couponMoney: 0,
    amountPrice: 0,
    amountNum: 0,
    couponId: '',
    totalPrice: '',
    msg: '',
    good: [],
    flagIndex: -1,
    couponShow: false,
    couponts: [],
    totalMoney: 0.00,
    shopAll: 0.00,
    endPrice:0.00,
    quan: '',
    bb: '',
    orderId: '', //提交订单id
    timeStamp: '',
    nonceStr: '',
    package: '',
    signType: '',
    paySign: '',
    payInfo: '',
    type: null, //以下参数为从商品详情进入所传参数
    goodId: null,
    goodName: '',
    goodInfo: null,
    buyNum: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //0: 普通商品， 1：秒杀商品, 2:9.9专区商品，3：砍价商品 4-积分商品 5-新人专享
    var type = options.type;
    if (type) { //从商品详情进入
      var allPrice = wx.getStorageSync('productInfo').price * options.buyNum;
      if(type!=4){
        that.setData({
          allPostFee: wx.getStorageSync('productInfo').postFee
        })
        var shopAll = allPrice + wx.getStorageSync('productInfo').postFee;
      }else{
        var shopAll = allPrice;
      }
      that.setData({
        type: type,
        goodId: options.goodId,
        buyNum: options.buyNum,
        goodName: options.goodName,
        productId: wx.getStorageSync('productInfo').id,
        goodInfo: wx.getStorageSync('productInfo'),
        allPrice: allPrice,
        shopAll: shopAll,
        endPrice:shopAll,
        bb: 2
      })
      
    } else { // 购物车确认订单
      that.getCartInfo();
    }
    //请求默认收货地址
    that.getDefaultAdr();
  },
  toAddressList: function(e) { //跳转到收货地址
    wx.navigateTo({
      // url: '/pages/address/address?iSorder'="1"
      url: '/pages/address/address'
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
    var that = this;
    var address = wx.getStorageSync('address'); //地址信息
    if (address) {
      console.log('cunzai----')
      that.setData({
        address: address
      })
    } else {
      console.log('cunza')
      that.getDefaultAdr();
    }
  },
  getCartInfo: function() { //从购物车进入获取商品信息
    let orderInfo = [];
    let _this = this;
    let showNum = wx.getStorageSync('cartOrder');
    wx.request({
      url: getApp().data.url + '/api/memberCart/enter',
      data: {
        userId: wx.getStorageSync('id'),
        cartList: showNum
      },
      method: 'post',
      success: function(res) {
        if (res.data.code == 0) {
          _this.setData({
            allPostFee: res.data.allPostFee,
            allPrice: res.data.allPrice,
            allNum: res.data.allNum,
            orderInfo: res.data.data,
          })
          let allPrice = _this.data.allPrice + _this.data.allPostFee
          _this.setData({
            shopAll: allPrice,
            endPrice:allPrice,
            bb: 2,
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            duration: 2000
          })
        }
      }

    })
  },
  //购物车创建订单
  guan: function() { //关闭遮罩
    this.setData({
      couponShow: false
    })
  }, //选择优惠券
  xuanCoupon() {
    let _this = this;
    let allPrice = _this.data.allPrice;
    wx.request({
      url: getApp().data.url + '/api/memberCoupon/getMyCanCouponList',
      data: {
        userId: wx.getStorageSync('id'),
        payment: allPrice,
        pageNumber: 1,
        pageSize: 10,
      },
      method: 'post',
      success: function(res) {
        if (res.data.code == 0) {
          console.log(res)
          var list = res.data.data.list;
          if (list.length > 0) {
            _this.setData({
              couponShow: true,
              couponts: list,
            })
          } else {
            wx.showToast({
              title: '暂无可用优惠劵',
            })
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            duration: 2000
          })
        }
      }
    })
  },
  
  selectCoupon: function(e) {
    console.log(e)
    var selectIndex = e.currentTarget.dataset.index
    this.setData({
      flagIndex: selectIndex,
      couponShow:false
    })
    this.confirmBtn();
  },
  // 确定所选优惠劵
  confirmBtn: function () {
    let delMoney = this.data.couponts[this.data.flagIndex];
    let totalMoney = delMoney.money; //优惠券金额
    let couponId = delMoney.id; //优惠券id
    let endPrice = this.data.shopAll - totalMoney;
    this.setData({
      coupon: delMoney.coupon_name,
      couponMoney: delMoney.coupon_money,
      totalMoney: totalMoney,
      couponId: delMoney.id,
      endPrice: endPrice,
      bb: '1',
    })
  },
  getMsg: function(e) {
    this.setData({
      msg: e.detail.value
    })
  },
  //获取默认收货地址
  getDefaultAdr: function() {
    var that = this;
    wx.request({
      url: getApp().data.url + '/api/member/address/getDefault',
      data: {
        userId: wx.getStorageSync('id')
      },
      method: 'post',
      success: function(res) {
        if (res.data.code == 0) {
          if (res.data.data) {
            that.setData({
              address: res.data.data

            });
            wx.setStorageSync('address', res.data.data)
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            duration: 2000
          })
        }
      }
    })
  },
  //提交订单
  orderBtn: function() {
    let _this = this;
    console.log('type', _this.data.type);
    console.log('address', _this.data.address);
    let showNum = wx.getStorageSync('cartOrder');
    let tjmsg = _this.data.msg; //留言
    // if(tjmsg !=''){ tjmsg='' }
    let postFee = _this.data.allPostFee;
    let couponId = _this.data.couponId; //优惠券id
    let addressId;
    
    if (!_this.data.address || !_this.data.address.id) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none',
        duration: 2000
      })
      return;
    } else {
      addressId = _this.data.address.id;
    }
    
    if (_this.data.type) { //从商品详情进入
      if (_this.data.type == 3) { //砍价商品
        _this.createBargain(tjmsg, postFee, addressId, couponId)
      } else if (_this.data.type == 4) { //积分商品
        _this.createInteg( tjmsg, addressId);
      }else { //普通、9.9、秒杀商品、新人专享
        _this.createOtherPro(tjmsg, postFee, addressId, couponId)
      }
    } else { //从购物车进入
      _this.createOrderCart(showNum, tjmsg, postFee, addressId, couponId);
    }
  },
  //砍价商品确认订单
  createBargain: function(tjmsg, postFee, addressId, couponId) {
    var that = this;
    var params = {
      userId: wx.getStorageSync('id'),
      buyerMsg: tjmsg,
      postFee: postFee,
      addressId: addressId,
      bargainId: that.data.goodId,
      productId: that.data.productId,
      total: that.data.buyNum,
      couponId: couponId
    }
    util.requestLoadingSuc(app.data.url + '/api/order/addBargainOrder', params, '正在加载中', function(res) {
      wx.redirectTo({
        url: '/pages/mineBargain/mineBargain',
      })
    })
  },
  //普通、9.9、秒杀商品确认订单
  createOtherPro: function(tjmsg, postFee, addressId, couponId) {
    var that = this;
    var params = {
      userId: wx.getStorageSync('id'),
      buyerMsg: tjmsg,
      postFee: postFee,
      addressId: addressId,
      type: that.data.type,
      id: that.data.goodId,
      productId: that.data.productId,
      total: that.data.buyNum,
      couponId: couponId,
      platform: 1
    }
    util.requestLoadingSuc(app.data.url + '/api/order/addGoodsOrder', params, '正在加载中', function(res) {
      wx.redirectTo({
        url: '../../pages/myOrder/myOrder?id=1',
      })
    })
  },
  //积分商品确认订单
  createInteg: function (tjmsg, addressId) {
    var that = this;
    var params = {
      userId: wx.getStorageSync('id'),
      buyerMsg: tjmsg,
      addressId: addressId,
      id: that.data.goodId,
      productId: that.data.productId,
      total: 1
    }
    util.requestLoadingSuc(app.data.url + '/api/score/addScoreGoodsOrder', params, '正在加载中', function (res) {
      wx.redirectTo({
        url: '../../pages/myOrderInteg/myOrderInteg',
      })
    })
  },
  //购物车商品确认订单
  createOrderCart: function(showNum, tjmsg, postFee, addressId, couponId) {
    let _this = this;
    wx.showLoading({
      title: '正在加载中',
    })
    wx.request({
      url: getApp().data.url + '/api/order/addCartOrder',
      data: {
        userId: wx.getStorageSync('id'),
        cartList: showNum,
        buyerMsg: tjmsg,
        postFee: postFee,
        addressId: addressId,
        couponId: couponId,
      },
      method: 'post',
      success: function(res) {
        console.log(res)
        if(res.data.code==0){
          wx.redirectTo({
            url: '../../pages/myOrder/myOrder?id=1',
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none',
            duration:2000
          })
        }
      }
    })
    wx.hideLoading();
  },

  //添加地址
  addRess: function() {

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
    wx.removeStorageSync('address')
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
  // },
})