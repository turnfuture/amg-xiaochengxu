// pages/index01/index1.js
const app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [], //首页轮播图
    Hei: "", //这是swiper要动态设置的高度属性
    nineData: [],
    spArr: [],
    fail: '',
    dataAdv: [], //首页广告图
    img_url:{},
    hidden: true, //隐藏表单控件
    page: 1, //当前请求数据是第几页
    pageSize: 3, //每页数据条数
    hasMoreData: true, //上拉时是否继续请求数据，即是否还有更多数据
    list: [],
    goodsid: '',
    kjCont: [],
    guangao: [],
    getTime: [],
    goodsTime: [],
    integData:{},
    newData:null,
    active: false,
    endval: '',
    zqList: [], //专区列表
    timeCur: 0,//秒杀选中的时间段下标
    nav01:[],
    isShowProp:false,//是否显示优惠券弹窗
    couponPrice:0,//优惠券金额
    code:'',//推广码
    shopId:''//平台
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const scene = decodeURIComponent(query.scene)
    console.log('onLoad', 'options---code----' + options.code)
    console.log('onLoad', 'options----shopId------------' + options.shopId)
    console.log('onLoad', 'options----flag------------' + options.flag)
    let _this = this;
    if (options.flag && options.flag != 'undefined'){//有flag表示是通过分享链接进入
      console.log('onLoad', 'if----flag------------')
      if (options.code && options.code != 'undefined') {
        console.log('onLoad', 'if----code------------')
        _this.setData({
          code: options.code
        })
      }
      if (options.shopId && options.shopId != 'undefined') {
        _this.setData({
          shopId: options.shopId
        })
      }
    }else{//从扫描二维码进入，需解析二维码中的参数信息
      console.log('onLoad', 'else----flag------------')
      const scene = decodeURIComponent(options.scene);
      console.log('onLoad', 'else----scene------------' + scene)
      if (scene && scene !='undefined'){
        console.log('onLoad', 'else----scene------if------')
        var params = scene.split(',');
        if (params.length > 0 && params[0] && params[0] != 'undefined') {
          _this.setData({
            code: params[0]
          })
        }
        if (params.length > 1 && params[1] && params[1] != 'undefined') {
          _this.setData({
            shopId: params[1]
          })
        }
      }
    }
    var openId = wx.getStorageSync('id')
    
    // console.log('onLoad', 'data---code----' + _this.data.code)
    if (!openId && wx.getStorageSync('isFirst')) {
      // console.log('onLoad', '------if----' + _this.data.code)
      wx.navigateTo({
        url: '/pages/authorize/authorize?code=' + _this.data.code + '&shopId=' + _this.data.shopId,
      })
    } else {
      if (!wx.getStorageSync('wxCode')){
        // _this.getWxCode()
      }
    }
    
    //轮播图
    wx.request({
      url: getApp().data.url + '/api/cms/slide/list',
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "POST",
      data: {
        type: '0'
      },
      success(res) {
        console.log('轮播图',res.data)
        let datas = res.data;
        let imgUrls = datas.data
        _this.setData({
          imgUrls: imgUrls
        })
      }
    }); 
    //首页广告图
    wx.request({
      url: getApp().data.url + '/api/cms/slide/list',
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "POST",
      data: {
        type: '1'
      },
      success(res) {
        console.log('广告图数据', res)
        if (res.data.code == 0) {
          _this.setData({
            guangao: res.data.data,
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000.
          })
        }
      }
    });
   
    //获取积分活动信息
    // util.requestLoadingSucGet(app.data.url + '/api/cms/score', {}, '正在加载中', function (res) {
    //   _this.setData({
    //     integData: res.data.data
    //   });
    // })
    // wx.request({ //砍价专区广告图
    //   url: getApp().data.url + '/api/cms/slide/list',
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   method: "POST",
    //   data: {
    //     type: '4'
    //   },
    //   success(res) {
    //     if (res.data.code == 0) {
    //       _this.setData({
    //         kjCont: res.data.data
    //       })
    //       console.log('砍价专区', _this.data.kjCont)
    //     } else {
    //       wx.showToast({
    //         title: res.data.msg,
    //         duration: 1000,
    //       })
    //     }
    //   }
    // });
    // wx.request({ //砍价专区列表
    //   url: getApp().data.url + '/api/cms/bargain',
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   method: "GET",
    //   success(res) {
    //     if (res.data.code == 0) {
    //       let zqList = res.data.data.goodsList.slice(0, 3)
    //       _this.setData({
    //         zqList: zqList
    //       })
    //       console.log('砍价专区列表', res.data.data)
    //     } else {
    //       wx.showToast({
    //         title: res.data.msg,
    //         duration: 1000,
    //       })
    //     }
    //   }
    // });
  },
  bannerToDetail:function(e){//各种广告图的点击事件
    var type = e.currentTarget.dataset.type;
    var id = e.currentTarget.dataset.id;
    if(type==0&&id){
      wx.navigateTo({
        url: '/pages/xiangqing/xiangqing?id='+id+'&type=0',
      })
    }
  },
  shopInfo: function(e) {
    let goodsid = encodeURIComponent(e.currentTarget.dataset.goodsid);
    console.log('主推商品id', goodsid)
    wx.navigateTo({
      url: '/pages/xiangqing/xiangqing?id=' + goodsid,
    })
  },
  toNewList:function(){//新人专享
    wx.navigateTo({
      url: '/pages/newPerson/newPerson',
    })
  },
  toNewDetail:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../xiangqing/xiangqing?id=' + id + '&type=5',
    })
  },
  miaosha: function(e) { //秒杀商品
    let _this = this
    let timeId = e.currentTarget.dataset.timeid
    let index = e.currentTarget.dataset.index
    let aNs = e.currentTarget.dataset.aNs
    if (aNs === '已经结束') {
      return
    }
    _this.setData({
      timeCur: index
    })
    // console.log("timeCur", timeCur);
    _this.getGoodsByTime(timeId)

  },
  getGoodsByTime: function(id) {
    let _this = this;
    //  秒杀时间段
    wx.request({
      url: getApp().data.url + '/api/goodsSpike/getGoodsByTime',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        timeId: id,
        pageNumber: 1,
        pageSize: 20,
        userId:wx.getStorageSync('id')
      },
      method: "POST",
      success(res) {
        console.log('getGoodsByTime', res)
        if (res.data.code == 0) {
          let list = res.data.data.list
          for (let i = 0; i < res.data.data.list.length; i++) {
            let namevue = res.data.data.list[i].num_sale / res.data.data.list[i].stock * 100
            let endval = namevue.toFixed(2)
            list[i].endvalPro = endval
          }
          _this.setData({
            goodsTime: list,
            active: true,
          })
          console.log("时间段id:" + id);
          console.log('秒杀商品', _this.data.goodsTime)
        }
      },
      fail(res) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        });
        _this.setData({
          fail: true,
        })

      }
    })
  },
  msxq: function(e) { //秒杀详情
    let id = e.currentTarget.dataset.id
    wx: wx.navigateTo({
      url: '/pages/xiangqing/xiangqing?id=' + id + '&type=' + 1,
    })
  },
  // 获取分页列表 普通商品  今日主推
  getInfo: function(message) { 
    var that = this;
    wx.showLoading({ //显示 loading 提示框
      title: message,
    })
    wx.request({
      url: getApp().data.url + '/api/goods/recommend',
      data: {
        type: '0',
        pageNum: that.data.page,
        pageSize: '20',
        userId: wx.getStorageSync('id')
      },
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log('今日主推', res)
        let contentlistTem = that.data.list;
        if (res.data.code == 0) {
          wx.hideLoading() //隐藏 loading 提示框
          if (that.data.page == 1) {
            contentlistTem = []
          }
          var list = res.data.data.list;
          if (list.length < that.data.pageSize) {
            that.setData({
              list: contentlistTem.concat(list),
              hasMoreData: false
            })
          } else {
            that.setData({
              list: contentlistTem.concat(list),
              hasMoreData: true,
              page: that.data.page + 1
            })
          }
        }
      },
      fail: function(res) {
        console.log('错了')
      },
      complete: function(res) {},
    })
  },
  imgH: function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
    var imgh = e.detail.height;　　　　　　　　　　　　　　　　 //图片高度
    var imgw = e.detail.width;
    var swiperH = winWid * imgh / imgw + "px"
    this.setData({
      Hei: swiperH　　　　　　　　 //设置高度
    })
  },
  toSpike: function (e) {
    wx.navigateTo({
      url: '/pages/miaosha/miaosha',
    })
  },
  kanjjia: function () {
    wx.navigateTo({
      url: '/pages/bargainList/bargainList',
    })
  },
  fenhong: function () {
    wx.navigateTo({
      url: '/pages/fenhong/fenhong',
    })
  },
  nav01: function () {//首页banner
    console.log('点击了首页广告tu')

  },
  toSearch: function () { //搜索
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  getWxCode:function(){
    var that = this;
    util.requestLoadingSuc(app.data.url + '/api/member/getExtension', { userId: wx.getStorageSync('id') }, '正在加载中', function (res) {
      //res就是我们请求接口返回的数据
      // wx.setStorageSync('wxCode', res.data.data.qrCode)
      wx.setStorageSync('wxCode', res.data.data.InvitationCode)
      // wx.setStorageSync('shopId', res.data.data.shopId)
      console.log('getWxCode', wx.getStorageSync('wxCode'))
      // console.log('shopId', wx.getStorageSync('shopId'))
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
    // wx.clearStorageSync()
    console.log('id', wx.getStorageSync('id'))
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
 
    let _this = this;
    var openId = wx.getStorageSync('id')
    if (!openId && !wx.getStorageSync('isFirst')) {
      wx.navigateTo({
        url: '/pages/authorize/authorize?code=' + _this.data.code + '&shopId=' + _this.data.shopId,
      })
    } else if (openId){
      //  秒杀时间段
      if (_this.data.getTime.length==0){
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
              var timeCur = res.data.data.length - 1;
              for (var i = 0; i < res.data.data.length; i++) {
                if (res.data.data[i].ans === "正在秒杀") {
                  timeCur = i;
                  _this.getGoodsByTime(res.data.data[i].timeId);
                  break;
                }
                if (res.data.data[i].ans === "即将开始") {
                  timeCur = i;
                  _this.getGoodsByTime(res.data.data[i].timeId);
                  break;
                }
              }
              _this.setData({
                getTime: res.data.data,
                timeCur: timeCur
              })
              console.log('timeCur', timeCur)
            }
          },
          fail(res) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            });
            _this.setData({
              fail: true,
            })

          }
        })
      }
      //  9.9
      if (_this.data.nineData.length==0){
        wx.request({
          url: getApp().data.url + '/api/cms/nine',
          header: {
            'content-type': 'application/json' // 默认值
          },
          method: "POST",
          data: {
            // type: '0',
            userId: wx.getStorageSync('id')
          },
          success(res) {
            if (res.data == '' || res.data == null) {
              wx.showToast({
                title: '没有数据',
                duration: 2000
              })
            } else {
              console.log(res.data)
              let spArr = [];
              if (res.data.data.goodsList != null && res.data.data.goodsList.length>3){
                //只取前三组
                spArr = res.data.data.goodsList.slice(0, 3); 
              }else{
                spArr = res.data.data.goodsList;
              }
              
              for (var i = 0; i < 3; i++) {
                spArr[i].newPrice = spArr[i].newPrice.toString().split(".")
              }
              _this.setData({
                nineData: spArr, //只取前三组
                img_url: res.data.data.img,
              })
              console.log('nineData', _this.data.nineData)
            }
          },
          fail(res) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            });
            _this.setData({
              fail: true,
            })

          }
        })
      }
      //新人专享
      if (!_this.data.newData) {
        util.requestLoadingSuc(app.data.url + '/api/cms/goodsNew', { userId: openId}, '正在加载中', function (res) {
          var data = res.data.data;
          if(data.goodsList.length>3){
            var list = data.goodsList.slice(0, 3);
            data.goodsList = list;
          }
          _this.setData({
            newData: data
          });
        })
      }
      //首页推荐商品
      _this.getInfo('正在加载数据...')
      console.log('wxCode', wx.getStorageSync('wxCode'))
      //请求获取推广二维码图片
      if (!wx.getStorageSync('wxCode')) {
        // _this.getWxCode()
      }
      //请求平台赠送优惠券
      util.requestLoadingSuc(app.data.url + '/api/memberCoupon/getNewCoupon', { userId: wx.getStorageSync('id') },'正在加载中' , function (res) {
        if (res.data.data.allPrice > 0) {
          _this.setData({
            couponPrice: res.data.data.allPrice,
            isShowProp: true
          })
        }
      })
    }
  },
  //  进入9.9商品列表
  nineList: function() {
    wx.navigateTo({
      url: '../../pages/nine/nine'
    })
  },
  //  进入9.9商品详情
  nine: function(e) {
    var id = e.currentTarget.dataset.id
    let _this = this;
    var index = e.currentTarget.dataset.idx;
    var list = _this.data.nineData;
    console.log('9.9商品详情', id)
    wx.navigateTo({
      url: '../../pages/xiangqing/xiangqing?id=' + id + '&type=' + 2
    })
  },
  toIntegList: function () { //积分列表
    wx.navigateTo({
      url: '/pages/integList/integList',
    })
  },
  toIntegDetail: function (e) { //积分-商品详情
    var id = e.currentTarget.dataset.id
    console.log('积分详情', id)
    wx.navigateTo({
      url: '../../pages/xiangqing/xiangqing?id=' + id + '&type=' + 4
    })
  },
  toCate: function () { //海外直购
    wx.setStorageSync('cateIdx', -1)
    wx.redirectTo({ 
      url: '/pages/fenlei/fenlei'
    })
  },
  toManager:function(){//跳转到掌柜升级页面
    wx.navigateTo({
      url: '/pages/homeShopkeeper/homeShopkeeper',
    })
  },
  kj: function() { //砍价列表
    wx.navigateTo({
      url: '/pages/bargainList/bargainList',
    })
  },
  kanjia: function(e) { //砍价详情
    var id = e.currentTarget.dataset.id
    console.log('砍价详情', id)
    wx.navigateTo({
      url: '../../pages/xiangqing/xiangqing?id=' + id + '&type=' + 3
    })
  },
  toCoupon: function (e) { //查看优惠券
    var that = this;
    wx.navigateTo({
      url: '/pages/youhui/youhui'
    })
    that.setData({
      isShowProp: false
    })

  },
  closeProp: function (e) { //关闭弹窗
    var that = this;
    that.setData({
      isShowProp: false
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
    let _this = this
    wx.showNavigationBarLoading()
    wx.request({
      url: getApp().data.url + '/api/cms/slide/list',
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "POST",
      data: {
        type: '0'
      },
      success(res) {
        console.log(res.data)
        let datas = res.data;
        let imgUrls = datas.data
        _this.setData({
          imgUrls: imgUrls
        })
      }
    }); //首页广告图
    wx.request({
      url: getApp().data.url + '/api/cms/slide/list',
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "POST",
      data: {
        type: '1'
      },
      success(res) {
        console.log('广告图数据', res)
        if (res.data.code == 0) {
          _this.setData({
            guangao: res.data.data,
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000.
          })
        }
      }
    });
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
              _this.getGoodsByTime(res.data.data[i].timeId);
              break;
            }
            if (res.data.data[i].ans === "即将开始") {
              timeCur = i;
              _this.getGoodsByTime(res.data.data[i].timeId);
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
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        });
        _this.setData({
          fail: true,
        })

      }
    })
    //  9.9
    wx.request({
      url: getApp().data.url + '/api/cms/nine',
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "POST",
      data: {
        userId: wx.getStorageSync('id')
      },
      success(res) {
        if (res.data == '' || res.data == null) {
          wx.showToast({
            title: '没有数据',
            duration: 2000
          })
        } else {
          console.log(res.data)
          console.log(res.data.data.goodsList)
          console.log(res.data.data.img)
          let spArr = [];
          if (res.data.data.goodsList != null && res.data.data.goodsList.length > 3) {
            //只取前三组
            spArr = res.data.data.goodsList.slice(0, 3);
          } else {
            spArr = res.data.data.goodsList;
          }
          for (var i = 0; i < 3; i++) {
            spArr[i].newPrice = spArr[i].newPrice.toString().split(".")
          }
          _this.setData({
            nineData: spArr, //只取前三组
            img_url: res.data.data.img,
          })
          console.log('nineData', _this.data.nineData)
        }
      },
      fail(res) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        });
        _this.setData({
          fail: true,
        })

      }
    })
    //新人专享
    if (!_this.data.newData) {
      util.requestLoadingSuc(app.data.url + '/api/cms/goodsNew', { userId: openId }, '正在加载中', function (res) {
        var data = res.data.data;
        if (data.goodsList.length > 3) {
          var list = data.goodsList.slice(0, 3);
          data.goodsList = list;
        }
        _this.setData({
          newData: data
        });
      })
    }
    // wx.request({ //砍价专区广告图
    //   url: getApp().data.url + '/api/cms/slide/list',
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   method: "POST",
    //   data: {
    //     type: '4'
    //   },
    //   success(res) {
    //     if (res.data.code == 0) {
    //       _this.setData({
    //         kjCont: res.data.data
    //       })
    //       console.log('砍价专区', _this.data.kjCont)
    //     } else {
    //       wx.showToast({
    //         title: res.data.msg,
    //         duration: 1000,
    //       })
    //     }
    //   }
    // });
    // wx.request({ //砍价专区列表
    //   url: getApp().data.url + '/api/cms/bargain',
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   method: "GET",
    //   success(res) {
    //     if (res.data.code == 0) {
    //       let zqList = res.data.data.goodsList.slice(0, 3)
    //       _this.setData({
    //         zqList: zqList
    //       })
    //       console.log('砍价专区列表', res.data.data)
    //     } else {
    //       wx.showToast({
    //         title: res.data.msg,
    //         duration: 1000,
    //       })
    //     }
    //   }
    // });
    _this.setData({
      page: 1
    });
    _this.getInfo('正在刷新数据')
    // 停止下拉动作  
    console.log('下拉页面', _this.data.page)
    wx.hideNavigationBarLoading()//在标题栏中隐藏加载
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.hasMoreData) {
      this.getInfo('加载更多数据')
    } else {
      // wx.showToast({
      //   title: '已经到底了....',
      // })
    }
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {
    // console.log('onShareAppMessage------------')
    // console.log('onShareAppMessage', wx.getStorageSync('wxCode'))
    //方案1：分享二维码
    // return {
    //   // title: app.globalData.title,
    //   imageUrl: wx.getStorageSync('wxCode'),//自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4。
    //   // path: '/pages/index/index',
    //   success: function (res) {
    //   },
    // }
    //分享链接
    // return {
    //   path: '/pages/index/index?code=' + wx.getStorageSync('wxCode'),
    //   success: function (res) {
    //   },
    // }
    
    //通用分享方法
    // util.shareInfo(1);
  // }
})