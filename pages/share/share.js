// pages/share/share.js
const app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curIndex: 0, //当前显示海报下标
    imgUrls: [],
    name: '',
    avator: null,
    shopId: '',
    InvitationCode: '',
    qrcode: null,
    width: 375,
    height: 603,
    swiperHeight: 0,
    shareShow: 'hidden'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var res = wx.getSystemInfoSync();

    //创建节点选择器
    var query = wx.createSelectorQuery();
    //获取按钮上方视图的高度
    query.select('#top').boundingClientRect()
    query.exec(function (res) {
      //res就是 所有标签为mjltest的元素的信息 的数组
      console.log(res);
      //取高度
      console.log(res[0].height);
      that.setData({
        swiperHeight: res[0].height,
      })
    })
    //获取整个视图的高度
    var query2 = wx.createSelectorQuery();
    query2.select('#content').boundingClientRect()
    query2.exec(function (res) {
      //res就是 所有标签为mjltest的元素的信息 的数组
      console.log(res);
      //取高度
      console.log(res[0].height);
      that.setData({
        width: res[0].width,
        height: res[0].height
      })
    })
    // that.setData({
    //   width: res.windowWidth,
    //   // height: res.screenHeight - 64,
    //   height: res.screenHeight,
    //   // swiperHeight: res.screenHeight - 145,
    // })
    util.requestLoadingSuc(app.data.url + '/api/member/getExtension', {
      userId: wx.getStorageSync('id')
    }, '正在加载中', function(res) {
      that.setData({
        imgUrls: res.data.data.imgurl,
        name: res.data.data.name,
        avator: res.data.data.avator,
        shopId: res.data.data.shopId,
        InvitationCode: res.data.data.InvitationCode,
        qrcode: res.data.data.qrCode
      })
      // that.save();
    })
  },
  chageImg: function(event) { //切换分享图片
    var that = this;
    console.log(event.detail.current)
    const ctx = wx.createCanvasContext('shareCanvas')
    //清除画布上在该矩形区域内的内容
    ctx.clearRect(0, 0, that.data.width, that.data.height);
    ctx.draw()
    this.setData({
      curIndex: event.detail.current
    })
  },
  save: function() { //保存图片
    var that = this;
    // const ctx = wx.createCanvasContext('shareCanvas')
    // //清除画布上在该矩形区域内的内容
    // ctx.clearRect(0, 0, that.data.width, that.data.height);
    // ctx.draw()
    //用canvas绘制页面效果
    const wxGetImageInfo = that.promisify(wx.getImageInfo)
    console.log(that.data.curIndex + "-----" + that.data.imgUrls[that.data.curIndex])
    Promise.all([
      wxGetImageInfo({
        src: that.data.imgUrls[that.data.curIndex]
      }),
      wxGetImageInfo({
        src: that.data.qrcode
      }),
      wxGetImageInfo({
        src: that.data.avator
      })
      // wxGetImageInfo({
      //   src: 'https://weixin.mrttg.com/img/666.jpg'
      // }),
      // wxGetImageInfo({
      //   src: 'https://weixin.mrttg.com/img/666.jpg'
      // }),
      // wxGetImageInfo({
      //   src: "https://wx.qlogo.cn/mmopen/vi_32/sFbxjDJs5MyiaTsEntEHfxHyTfXLpiam8Q9mF0ZGaaaFOgBG7o17IAvH6VicJ5D2x5qFBA2pdLdCk5nIGVH9pOfRA/132"
      // })
    ]).then(res => {
      const ctx = wx.createCanvasContext('shareCanvas')
      //清除画布上在该矩形区域内的内容
      ctx.clearRect(0, 0, that.data.width, that.data.height);
      
      // 底图
      console.log("img",res[0])
      ctx.drawImage(res[0].path, 0, 0, that.data.width, that.data.height)

      //底部背景色
      var bgY = that.data.height - 100;
      var bgWidth = that.data.width - 20;
      that.roundRect(ctx, 10, bgY, bgWidth, 90, 5, '#fff');

      // 小程序码
      var imgX = that.data.width - 70;
      var imgY = that.data.height - 80;
      ctx.drawImage(res[1].path, imgX, imgY, 50, 50)

      //左侧用户头像
      var avatorY = that.data.height - 10 - 90 + 10;
      ctx.save();
      ctx.beginPath(); //开始绘制
      //先画个圆
      ctx.arc(37.5, (avatorY+12.5), 12.5, 0, Math.PI * 2, false);
      ctx.clip();//画了圆 再剪切 原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内
      ctx.drawImage(res[2].path, 25, avatorY, 25, 25); // 推进去图片
      ctx.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图上下午即状态 可以继续绘制

      //左侧用户昵称
      var nameY = avatorY + 40;
      // ctx.setTextAlign('center')   
      ctx.setFillStyle('#333')
      ctx.setFontSize(14)
      ctx.fillText(that.data.name, 25, nameY,(that.data.width-105))
      //左侧提示文字
      var tipY = nameY + 10;
      that.roundRect(ctx, 20, tipY, 110, 20, 10, '#020202');
      ctx.setFillStyle('#fff')
      ctx.setFontSize(11)
      ctx.fillText('长按识别小程序码', 30, (tipY + 13))

      //保存图片至相册
      const wxCanvasToTempFilePath = that.promisify(wx.canvasToTempFilePath)
      const wxSaveImageToPhotosAlbum = that.promisify(wx.saveImageToPhotosAlbum)
      that.setData({
        shareShow: 'hidden'
      })
      ctx.stroke()
      // ctx.draw();
      ctx.draw(false,()=>{
        wxCanvasToTempFilePath({
          canvasId: 'shareCanvas',
        }, this).then(res => {
          console.log('filePath', res.tempFilePath);
          return wxSaveImageToPhotosAlbum({
            filePath: res.tempFilePath
          })
        }).then(res => {
          wx.showToast({
            title: '已保存到相册'
          })
        })
      })
      
    })
  },
  promisify: api => {
    return (options, ...params) => {
      return new Promise((resolve, reject) => {
        const extras = {
          success: resolve,
          fail: reject
        }
        api({ ...options,
          ...extras
        }, ...params)
      })
    }
  },
  /**
   * 
   * @param {CanvasContext} ctx canvas上下文
   * @param {number} x 圆角矩形选区的左上角 x坐标
   * @param {number} y 圆角矩形选区的左上角 y坐标
   * @param {number} w 圆角矩形选区的宽度
   * @param {number} h 圆角矩形选区的高度
   * @param {number} r 圆角的半径
   */
  roundRect: function(ctx, x, y, w, h, r, bg) {
    // 开始绘制
    ctx.beginPath()
    // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
    // 这里是使用 fill 还是 stroke都可以，二选一即可
    ctx.setFillStyle(bg)
    // ctx.setStrokeStyle('transparent')
    // 左上角
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)

    // border-top
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.lineTo(x + w, y + r)
    // 右上角
    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

    // border-right
    ctx.lineTo(x + w, y + h - r)
    ctx.lineTo(x + w - r, y + h)
    // 右下角
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

    // border-bottom
    ctx.lineTo(x + r, y + h)
    ctx.lineTo(x, y + h - r)
    // 左下角
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

    // border-left
    ctx.lineTo(x, y + r)
    ctx.lineTo(x + r, y)

    // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
    ctx.fill()
    // ctx.stroke()
    ctx.closePath()
    // 剪切
    ctx.clip()
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
  onShareAppMessage: function() {
    var that = this;
    //分享链接
    return {
      imageUrl: that.data.imgUrls[that.data.curIndex],
      path: '/pages/index/index?code=' + that.data.InvitationCode + "&shopId=" + that.data.shopId + '&flag=1',
      success: function(res) {},
    }
  }
})