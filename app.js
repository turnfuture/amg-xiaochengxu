//app.js
App({
  onLaunch: function() {
    wx.setStorageSync('isFirst', true)
  },
  globalData: {
     userInfo: null
  },
  data: {
    //  url: 'http://192.168.1.108:8081',
    // url:'https://weixin.mrttg.com',
    url: 'https://amg.aitaunkj.com',
    userId: null,
  },
  loaDing: function() {
    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      duration: 1000,
    });
  },
})