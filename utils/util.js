const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//分享通用方法
const shareInfo = n => {
  return {
    path: '/pages/index/index?code=' + wx.getStorageSync('wxCode')+'&flag='+n,
    success: function (res) {
    },
  }
}

// 展示加载框的网络请求
// url:网络请求的url
// params:请求参数
// message:进度条的提示信息
// success:成功的回调函数
function requestLoadingSuc(url, params, message, success) {
  console.log(params)
  wx.showLoading({
    title: message,
  })
  wx.request({
    url: url,
    data: params,
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'post',
    success: function (res) {
      console.log(url)
      console.log(res)
      wx.hideLoading()
      if (res.data.code == 0) {
        success(res)
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }

    },
    fail: function (res) {
      wx.hideLoading()
      wx.showToast({
        title: '加载数据失败',
        icon: 'none',
        duration: 2000
      })
    },
    complete: function (res) {

    },
  })
}

function requestLoadingSucGet(url, params, message, success) {
  console.log(params)
  wx.showLoading({
    title: message,
  })
  wx.request({
    url: url,
    data: params,
    header: {
      'content-type': 'application/json' // 默认值
    },
    method: 'get',
    success: function (res) {
      console.log(url)
      console.log(res)
      wx.hideLoading()
      if (res.data.code == 0) {
        success(res)
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }

    },
    fail: function (res) {
      wx.hideLoading()
      wx.showToast({
        title: '加载数据失败',
        icon: 'none',
        duration: 2000
      })
    },
    complete: function (res) {

    },
  })
}

module.exports = {
  formatTime: formatTime,
  requestLoadingSuc: requestLoadingSuc,
  requestLoadingSucGet: requestLoadingSucGet
}
