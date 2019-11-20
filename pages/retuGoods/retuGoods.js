// pages/retuGoods/retuGoods.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
 
    orderId: '',
    expressName: '',
    expressCode: '',
    reason: '',
    num: '',
    money: '',
    context: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let orderId = options.id;
    this.setData({
      orderId: orderId,
    })

  },
  inputs: function(e) { //物流单号
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber: len, //当前字数 
      context: value
    });
  },
  getNum: function(e) { //物流名
    this.setData({
      num: e.detail.value
    })
  },
  getMoeny: function(e) { //物流单号
    this.setData({
      money: e.detail.value
    })
  },
  returnGoods: function() {
    var that = this;
    let num = that.data.num
    let money = that.data.money
    let context = that.data.context
    if(!num){
      wx.showToast({
        title: '请输入物流名称',
        icon:'none',
        duration:2000
      })
      return;
    }
    if (!money) {
      wx.showToast({
        title: '请输入物流单号',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (!context) {
      wx.showToast({
        title: '请输入退货原因',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.request({
      url: getApp().data.url + '/api/order/backGood',
      data: {
        userId: wx.getStorageSync('id'),
        id: that.data.orderId,
        expressName: num,
        expressCode: money,
        reason: context,
  
      },
      method: 'post',
      success: function(res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '退货成功',
            duration: 1000,
          })
          wx.navigateBack({
            delta: 1
          })
        }
      }
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