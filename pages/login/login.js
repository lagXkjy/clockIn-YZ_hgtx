const $common = require('../../utils/common.js')
Page({
  data: {
    options: {},
    isGetInfo: false, //是否需要获取用户头像
    bgImage: ''
  },
  getBg() { //获取背景图
    $common.request('POST', $common.config.GetLittleProImg, null, (res) => {
      this.setData({ bgImage: res.data.img })
    })
  },
  getUserInfo(e) {
    let userInfo = e.detail.userInfo
    if (!userInfo) return
    $common.getOpenid(() => {
      $common.getUserInfo(userInfo, this.analy)
    })
  },
  analy() {  //解析分享的地址，并跳转至目标页面
    const url = this.data.options.url
    if (url) { //是分享过来的，需要跳转到指定页面
      const { data } = this.data.options
      try {
        let array = JSON.parse(data)
        let arr = []
        for (let i = 0, len = array.length; i < len; i++) {
          arr.push(`${array[i].key}=${array[i].value}`)
        }
        setTimeout(() => { //安卓手机有问题
          wx.reLaunch({ url: `${url}?${arr.join('&')}`, fail: this.toClockIn})
        }, 200)
      } catch (err) { //一有报错，跳转到首页
        this.toClockIn()
      }
    } else {
      this.toClockIn()
    }
  },
  toClockIn() {
    setTimeout(() => {
      wx.reLaunch({ url: '/pages/clockIn/clockIn/clockIn' })
    }, 200)
  },
  onLoad: function (options) {
    /*
     分享时需要传的参数长这样
     options.url = '/pages/clockIn/createNewTheme/createNewTheme'
     let arr = [{ key: 'id', value: 1 }]
     options.data = JSON.stringify(arr)
    */
    this.data.options = options
    const prevGetInfo = wx.getStorageSync('prevGetInfo') || 0 //上一次获取头像的时间戳
    const nowData = new Date().getTime()
    let isGetInfo = false
    if (nowData > prevGetInfo * 604800000) { //用户头像7天获取一次
      isGetInfo = true
      this.getBg()
    } else {
      $common.getOpenid(this.analy)
    }
    this.setData({ isGetInfo })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return $common.share()
  }
})