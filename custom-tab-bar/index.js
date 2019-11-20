Component({
  properties: {
    selected: {
      type: String,
      value: '0'
    },
    totalPrice: {
      type: String,
      value: '0'
    },
    show_edit: {
      type: Boolean,
      value: true
    }
  },
  data: {
    "color": "#CD6E70",
    "selectedColor": "#fff",
    list: [
      {
        pagePath: "/pages/index/index",
        text: "首页",
        iconPath: "/images/home1.png",
        selectedIconPath: "/images/home.png"
      },
      {
        pagePath: "/pages/fenlei/fenlei",
        text: "分类",
        iconPath: "/images/class1.png",
        selectedIconPath: "/images/class.png"
      },
      {
        pagePath: "/pages/shopCar/shopCar",
        text: "购物车",
        iconPath: "/images/car1.png",
        selectedIconPath: "/images/car.png"
      },
      {
        pagePath: "/pages/perSoner/perSoner",
        text: "我的",
        iconPath: "/images/user1.png",
        selectedIconPath: "/images/user.png"
      }
    ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.reLaunch({url})
    },
    toShare(){
      wx.navigateTo({
        url: '/pages/share/share',
      })
    },
    sub () {
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('sub', myEventDetail, myEventOption)
    },
    delete () {
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('delete', myEventDetail, myEventOption)
    }
  }
})

// lsl修改文件，自定义tabbar——>app.json文件
// "tabBar": {
//   "custom": true,
//   "color": "#CD6E70",
//   "selectedColor": "#fff",
//   "borderStyle": "black",
//   "backgroundColor": "#ffffff",
//   "list": [
//     {
//       "pagePath": "pages/index/index",
//       "text": "首页",
//       "iconPath": "images/home.png",
//       "selectedIconPath": "images/home1.png"
//     },
//     {
//       "pagePath": "pages/fenlei/fenlei",
//       "text": "分类",
//       "iconPath": "images/class.png",
//       "selectedIconPath": "images/class1.png"
//     },
//     {
//       "pagePath": "pages/shopCar/shopCar",
//       "text": "购物车",
//       "iconPath": "images/car.png",
//       "selectedIconPath": "images/car1.png"
//     },
//     {
//       "pagePath": "pages/perSoner/perSoner",
//       "text": "我的",
//       "iconPath": "images/user.png",
//       "selectedIconPath": "images/user1.png"
//     }
//   ]
// },