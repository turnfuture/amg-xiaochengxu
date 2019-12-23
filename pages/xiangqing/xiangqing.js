// pages/xiangqing/xiangqing.js
const App = getApp()
var util = require('../../utils/util.js')
var i;
Page({
  data: {
    id: '', //普通商品id  秒杀商品id  9.9商品id  砍价商品id 
    type: 0, //	0: 普通商品， 1：秒杀商品, 2:9.9专区商品，3：砍价商品  4-积分商品 5-新人专享
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    display: '',
    clAss: '',
    goodId: '', //首页3个9.9列表id
    banners: [], //轮播图
    goodsImg: [], //商品详情图
    name: '', //商品名字
    spikePrice: '', //专区价格
    price: '', //商品价格
    priceOrignal: '', //商品原价，除普通商品外都有
    goodDetail: {},
    isfollow: '', //是否收藏
    showId: 0,
    currentTab: 0,
    payNum: 1,
    noWid: '', //请求评价需要的商品id
    list: [], //分页
    fylist: [], //分页
    contentlist: [], //分页
    page: 1, //当前请求数据是第几页
    pageSize: 3, //每页数据条数
    hidden: true, //隐藏表单控件
    hasMoreData: true, //上拉时是否继续请求数据，即是否还有更多数据
    transition: '1s all linear',
    color: '',
    heidde: false,
    pageNumEva: 1, //商品评价当前页码
    isLast: false, //商品评价是否为最后一页
    evaluateList: [], //商品评论列表
    actEndTime: '', //结束时间
    countDown: {}, //倒计时
    isStart:false,//秒杀商品是否处于进行中
    isFinish: false ,//秒杀是否已结束
    isShowParams:false,//是否显示产品参数弹窗
    proParams:[]//产品参数
  },

  onLoad: function(options) {
    let _this = this;
    let zqId = options.id;
    _this.setData({
      id: zqId
    })
    if (options.type) {
      _this.setData({
        type: options.type
      })
    }
    if (_this.data.type == 0) { //普通商品
      _this.getDetailOrdinary(zqId);
    } else if (_this.data.type == 1) { //秒杀商品
      _this.getDetailSpike();
    } else if (_this.data.type == 2) { //9.9商品
      _this.getDetailNine();
    } else if (_this.data.type == 3) { //砍价商品
      _this.getDetailBargain();
    }else if(_this.data.type==4){//积分商品
      _this.getDetailInteg();
    } else if (_this.data.type == 5) {//新人专享
      _this.getDetailNew();
    }
  },
  //普通商品详情接口
  getDetailOrdinary: function(zqId) {
    let _this = this
    getApp().loaDing();
    wx.request({
      url: getApp().data.url + '/api/goods/goods/getDetail',
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "POST",
      data: {
        userId: wx.getStorageSync('id'),
        goodsId: zqId,
      },
      success(res) {
        console.log(res)
        if (res.data.code != 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          let datas = res.data
          let banners = datas.data.banner
          let spec = JSON.parse(datas.data.spec);
          let sku = new Array();
          for (let i = 0; i < spec.length; i++) {
            sku[i] = spec[i].spec_values[0].spec_value_name
          }
          let proParams = datas.data.params?JSON.parse(datas.data.param):[];
          _this.setData({
            banners: banners,
            name: res.data.data.name,
            spikePrice: datas.data.spikePrice,
            price: datas.data.price,
            goodsImg: datas.data.goodsImg,
            goodDetail: res.data.data,
            isfollow: datas.data.isfollow,
            productList: datas.data.productList,
            skus: spec,
            moSku: sku,
            noWid: datas.data.goodsId,
            proParams: proParams
          })
        }
        if (_this.data.isfollow) {
          _this.setData({
            color: '#dd191d'
          })
        } else {
          _this.setData({
            color: 'gray'
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
    wx.hideLoading();
  },
  //秒杀商品详情接口
  getDetailSpike: function() {
    var that = this;
    util.requestLoadingSuc(App.data.url + '/api/goods/goods/getSpikeDetail', {
      userId: wx.getStorageSync('id'),
      spikeId: that.data.id
    }, '正在加载中', function(res) {
      let datas = res.data
      let banners = datas.data.banner
      let spec = JSON.parse(datas.data.spec);
      console.log('spec', spec)
      let sku = new Array();
      for (let i = 0; i < spec.length; i++) {
        sku[i] = spec[i].spec_values[0].spec_value_name
      }
      console.log('开始时间:'+new Date(res.data.data.startTime.replace(/-/g, "/")).getTime())
      wx.showToast({
        title: new Date(res.data.data.startTime.replace(/-/g, "/")).getTime(),
      })
      var isStart = new Date().getTime() >= new Date(res.data.data.startTime.replace(/-/g, "/")).getTime()?true:false;
      let proParams = JSON.parse(datas.data.param);
      that.setData({
        banners: banners,
        name: res.data.data.name,
        price: datas.data.spikePrice,
        priceOrignal: datas.data.price,
        goodsImg: datas.data.goodsImg,
        goodDetail: res.data.data,
        isfollow: datas.data.isfollow,
        productList: datas.data.productList,
        skus: spec,
        moSku: sku,
        noWid: datas.data.goodsId,
        actEndTime: res.data.data.endTime,
        proParams:proParams,
        isStart: isStart
      })
      // 执行倒计时函数
      that.countDown();

      if (that.data.isfollow) {
        that.setData({
          color: '#dd191d'
        })
      } else {
        that.setData({
          color: '#333'
        })
      }
    })
  },
  //9.9商品详情接口
  getDetailNine: function() {
    var that = this;
    util.requestLoadingSuc(App.data.url + '/api/goods/goods/getNineDetail', {
      userId: wx.getStorageSync('id'),
      nineId: that.data.id
    }, '正在加载中', function(res) {
      let datas = res.data
      let banners = datas.data.banner
      let spec = JSON.parse(datas.data.spec);
      console.log('spec', spec)
      let sku = new Array();
      for (let i = 0; i < spec.length; i++) {
        sku[i] = spec[i].spec_values[0].spec_value_name
      }
      let proParams = JSON.parse(datas.data.param);
      that.setData({
        banners: banners,
        name: res.data.data.name,
        price: datas.data.spikePrice,
        priceOrignal: datas.data.price,
        goodsImg: datas.data.goodsImg,
        goodDetail: res.data.data,
        isfollow: datas.data.isfollow,
        productList: datas.data.productList,
        skus: spec,
        moSku: sku,
        noWid: datas.data.goodsId,
        proParams:proParams
      })

      if (that.data.isfollow) {
        that.setData({
          color: '#dd191d'
        })
      } else {
        that.setData({
          color: '#333'
        })
      }
    })
  },
  //积分商品详情接口
  getDetailInteg: function () {
    var that = this;
    util.requestLoadingSuc(App.data.url + '/api/goods/goods/getScoreDetail', {
      userId: wx.getStorageSync('id'),
      scoreId: that.data.id
    }, '正在加载中', function (res) {
      let datas = res.data
      let banners = datas.data.banner
      let spec = JSON.parse(datas.data.spec);
      console.log('spec', spec)
      let sku = new Array();
      for (let i = 0; i < spec.length; i++) {
        sku[i] = spec[i].spec_values[0].spec_value_name
      }
      let proParams = JSON.parse(datas.data.param);
      that.setData({
        banners: banners,
        name: res.data.data.name,
        price: datas.data.spikePrice,
        priceOrignal: datas.data.price,
        goodsImg: datas.data.goodsImg,
        goodDetail: res.data.data,
        isfollow: datas.data.isfollow,
        productList: datas.data.productList,
        skus: spec,
        moSku: sku,
        noWid: datas.data.goodsId,
        proParams: proParams
      })

      if (that.data.isfollow) {
        that.setData({
          color: '#dd191d'
        })
      } else {
        that.setData({
          color: '#333'
        })
      }
    })
  },
  //砍价商品详情接口
  getDetailBargain: function() {
    var that = this;
    util.requestLoadingSuc(App.data.url + '/api/goods/goods/getBargainDetail', {
      userId: wx.getStorageSync('id'),
      bargainId: that.data.id
    }, '正在加载中', function(res) {
      let datas = res.data
      let banners = datas.data.banner
      let spec = JSON.parse(datas.data.spec);
      console.log('spec', spec)
      let sku = new Array();
      for (let i = 0; i < spec.length; i++) {
        sku[i] = spec[i].spec_values[0].spec_value_name
      }
      let proParams = JSON.parse(datas.data.param);
      that.setData({
        banners: banners,
        name: res.data.data.name,
        price: datas.data.spikePrice,
        priceOrignal: datas.data.price,
        goodsImg: datas.data.goodsImg,
        goodDetail: res.data.data,
        isfollow: datas.data.isfollow,
        productList: datas.data.productList,
        skus: spec,
        moSku: sku,
        noWid: datas.data.goodsId,
        proParams:proParams
      })

      if (that.data.isfollow) {
        that.setData({
          color: '#dd191d'
        })
      } else {
        that.setData({
          color: '#333'
        })
      }
    })
  },
  //新人专享商品详情接口
  getDetailNew: function () {
    var that = this;
    util.requestLoadingSuc(App.data.url + '/api/goods/goods/getNewDetail', {
      userId: wx.getStorageSync('id'),
      newId: that.data.id
    }, '正在加载中', function (res) {
      let datas = res.data
      let banners = datas.data.banner
      let spec = JSON.parse(datas.data.spec);
      console.log('spec', spec)
      let sku = new Array();
      for (let i = 0; i < spec.length; i++) {
        sku[i] = spec[i].spec_values[0].spec_value_name
      }
      let proParams = JSON.parse(datas.data.param);
      that.setData({
        banners: banners,
        name: res.data.data.name,
        price: datas.data.spikePrice,
        priceOrignal: datas.data.price,
        goodsImg: datas.data.goodsImg,
        goodDetail: res.data.data,
        isfollow: datas.data.isfollow,
        productList: datas.data.productList,
        skus: spec,
        moSku: sku,
        noWid: datas.data.goodsId,
        proParams: proParams
      })

      if (that.data.isfollow) {
        that.setData({
          color: '#dd191d'
        })
      } else {
        that.setData({
          color: '#333'
        })
      }
    })
  },
  //今日主推
  getInfofy: function() {
    var that = this;
    wx.request({
      url: getApp().data.url + '/api/goods/recommend',
      data: {
        type: '1',
        pageNum: that.data.page,
        pageSize: '10',
        userId:wx.getStorageSync('id')
      },

      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res);
        let contentlistTem = that.data.list;
        if (res.data.code == 0) {
          that.setData({
            list: res.data.data.list,
            hasMoreData: false
          })
        }
      },
      fail: function(res) {

      },
      complete: function(res) {},
    })
  },
  //获取商品的评价列表
  getEvaluateList: function() {
    var that = this;
    var params = {
      goodsId: that.data.goodDetail.goodsId,
      userId: wx.getStorageSync('id'),
      pageNum: that.data.pageNumEva,
      pageSize: '20'
    }
    var evaluateList = that.data.evaluateList;
    util.requestLoadingSuc(App.data.url + '/api/goods/getGoodsComent', params, '正在加载中', function(res) {
      //res就是我们请求接口返回的数据
      if (that.data.pageNum == 1) {
        evaluateList = [];
      }
      evaluateList = evaluateList.concat(res.data.data.list)
      that.setData({
        evaluateList: evaluateList,
        isLast: res.data.data.hasNextPage
      });
    })
  },
  // 
  skuItem: function(e) {
    var that = this;
    //大分类Index
    var idx1 = e.currentTarget.dataset.idx;
    //子分类index
    var idx2 = e.currentTarget.dataset.index;
    var dateMoSku = this.data.moSku;
    dateMoSku[idx1] = this.data.skus[idx1].spec_values[idx2].spec_value_name;
    that.setData({
      moSku: dateMoSku
    })
    this.getInfo(this.data.moSku);
  },
  //获取当前所选规格商品对应的信息
  getInfo: function(data) {
    console.log('data', data)
    var that = this;
    var stockName = "";
    var dateMoSku = data; //选中规格名称
    var skus = that.data.skus; //所有规格数组
    for (var i = 0; i < skus.length; i++) {
      var name = skus[i].spec_name + ':' + dateMoSku[i] + '*';
      stockName += name;
    }
    stockName = stockName.substr(0, stockName.length - 1)
    //根据规格请求商品信息
    var params = {
      id: that.data.id,
      spec: stockName,
      userId: wx.getStorageSync('id'),
      type: that.data.type
    }
    util.requestLoadingSuc(App.data.url + '/api/goods/getProduct', params, '正在加载中', function(res) {
      that.setData({
        productInfo: res.data.data,
        price: res.data.data.price
      });
    })

  },
  //推荐商品跳详情
  tjxq: function(e) {
    let id = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: '/pages/xiangqing/xiangqing?id=' + id + '&type=0',
    })
  },
  //点击切换
  change: function(e) {
    var _this = this;
    var type = e.target.dataset.type;
    if (_this.data.currentTab == type) {
      return false;
    }
    _this.setData({
      currentTab: type,

    })
    if (_this.data.currentTab == 2) { //评价
      _this.setData({
        pageNumEva: 1,
        evaluateList: []
      })
      let pjGoodsid = _this.data.noWid
      _this.getEvaluateList()
    } else if (_this.data.currentTab == 1) { //推荐商品
      _this.getInfofy()

    } else if (_this.data.currentTab == 0) {}
  },
  goShop: function() { //跳购物车
    wx.reLaunch({
      url: '../../pages/shopCar/shopCar'
    })
  },
  //数量减
  down: function(e) {
    var num = this.data.payNum;
    if (num <= 1 || this.data.productInfo.stock == 0) {
      return
    } else {
      this.setData({
        payNum: --num
      })
    }
  },
  //数量加
  up: function(e) {
    var num = this.data.payNum;
    if (num >= this.data.productInfo.stock) {

      wx.showToast({
        title: '大于库存',
        duration: 2000,
      })
      return
    } else {
      this.setData({
        payNum: ++num
      })
    }
  },
  //收藏
  collection: function() {
    var _this = this
    wx.request({
      url: getApp().data.url + '/api/memberFollow/setFollow',
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "POST",
      data: {
        userId: wx.getStorageSync('id'),
        goodsId: _this.data.goodDetail.goodsId,
      },
      success(res) {
        if (res.data.msg == "取消关注") {
          _this.setData({
            color: '#333',
            isfollow:false
          })
          wx.showToast({
            title: '取消收藏',
          })
        } else if ((res.data.msg == "关注成功")) {
          _this.setData({
            color: '#dd191d',
            isfollow: true
          })
          wx.showToast({
            title: '收藏成功',
          })
        } else {
          wx.showToast({
            title: '数据有误',
          })

        }
      }
    })
  },
  //加入购物车
  addCart: function(e) {
    var _this = this
    if (_this.data.isFinish && _this.data.type == 1) { //秒杀商品且倒计时已结束
      wx.showToast({
        title: '该商品秒杀已结束',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var guigeId = e.currentTarget.dataset.id;
    var carNum = _this.data.payNum;
    wx.request({
      url: getApp().data.url + '/api/memberCart/addCart',
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "POST",
      data: {
        userId: wx.getStorageSync('id'),
        goodsId: _this.data.goodDetail.goodsId,
        productId: guigeId,
        num: carNum,
      },
      success(res) {
        if (res.data.code == 0) {
          wx.showToast({
              title: '加入购物车成功',
            }),
            _this.setData({
              clAss: false,
              heidde: false,
            })
        }
      }
    })
  },
  //立即购买
  toBuy: function() { //立即购买
    var that = this;
    var productInfo = that.data.productInfo;
    
    wx.setStorageSync('productInfo', productInfo)
    wx.navigateTo({
      url: '/pages/order/order?goodId=' + that.data.id + '&type=' + that.data.type + '&buyNum=' + that.data.payNum + '&goodName=' + that.data.name,
    })
    that.setData({
      clAss: false,
      heidde: false,
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.currentTab == 2) { //商品评论
      const that = this;
      if (that.data.isLast) {
        var pageNumEva = that.data.pageNumEva + 1;
        that.setData({
          pageNumEva: pageNumEva
        });
        that.getEvaluateList();
      }
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
 
  showProParams:function(e){//显示产品参数弹窗
    this.setData({
      isShowParams:true
    })
  },
  hideProParams: function (e) {//关闭产品参数弹窗
    this.setData({
      isShowParams: false
    })
  },
  showview: function() {
    if (!this.data.isStart && this.data.type == 1) { //秒杀商品且未开始秒杀
      wx.showToast({
        title: '该商品秒杀还未开始',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (this.data.isFinish && this.data.type == 1) { //秒杀商品且倒计时已结束
      wx.showToast({
        title: '该商品秒杀已结束',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    this.setData({
      display: "block",
       heidde: true,
      maskHeight: 0,
      //设置默认值
      product: this.data.productList[0]
    })
    // if (this.data.productList.length>1){
      this.getInfo(this.data.moSku);
    // }else{
      // this.setData({
      //   productInfo: this.data.productList[0]
      // })
    // }
  },
  hideview: function() {
    this.setData({
      heidde: false
    })
  },
  changeIndicatorDots: function(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  timeFormat(param) { //小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  countDown() { //倒计时函数
    var that = this;
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
   
    // 对结束时间进行处理渲染到页面
    // endTimeList.forEach(o => {
    let endTime = new Date(that.data.actEndTime.replace(/-/g, "/")).getTime();
    let obj = null;
    let isFinish = that.data.isFinish;
    // 如果活动未结束，对时间进行处理
    if (endTime - newTime > 0 && !isFinish) {
      let time = (endTime - newTime) / 1000;
      // 获取天、时、分、秒
      let day = parseInt(time / (60 * 60 * 24));
      let hou = parseInt(time % (60 * 60 * 24) / 3600);
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
      if (day > 0) {
        hou = hou * day;
      }
      obj = {
        // day: that.timeFormat(day),
        hou: that.timeFormat(hou),
        min: that.timeFormat(min),
        sec: that.timeFormat(sec)
      }
    } else { //活动已结束，全部设置为'00'
      obj = {
        day: '00',
        hou: '00',
        min: '00',
        sec: '00'
      }
      isFinish = true;
    }
    // 渲染，然后每隔一秒执行一次倒计时函数
    that.setData({
      countDown: obj,
      isFinish: isFinish
    })
    if (!isFinish) {
      setTimeout(that.countDown, 1000);
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