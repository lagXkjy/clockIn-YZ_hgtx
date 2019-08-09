// pages/New/index/index.js
const app = getApp()
const { $common } = app
Page({
  data: {
    IntegralSum:0,
    ConsumeIntegralSum:0,
    list: [{
      url: '/images/clock3.png',
      title: "我的打卡日记",
      to: '/pages/clockIn/myClockInDiary/myClockInDiary'
    },{
      url: '/images/myExamination.png',
      title: "我的考试",
      to: '/pages/clockIn/myExamination/myExamination'
    },{
        url: '/images/myFund.png',
      title: "我的学习基金",
        to: '/pages/clockIn/myFund/myFund'
      }, {
        url: '/images/integral.png',
        title: "积分商城",
        to: '/pages/clockIn/IntegralMall/IntegralMall'
      }],
  },
  jump(e) { // 跳转
    wx.navigateTo({ url: e.currentTarget.dataset.to })
  },
  GetUserIntegral(){
    $common.loading();
    $common.request(
      'POST',
      $common.config.GetUserIntegral, {
        openId: wx.getStorageSync('openid'),
      },
      (res) => {
        if (res.data.res) {
          this.setData({
            IntegralSum: res.data.IntegralSum,
            ConsumeIntegralSum: res.data.ConsumeIntegralSum
          })
        } else {
          $common.showToast('亲~网络不给力哦，请稍后重试')
        }
      },
      (res) => {
        $common.showModal('亲~网络不给力哦，请稍后重试');
      },
      (res) => {
        $common.hide();
      }
    )
  },
  onLoad: function (options) {
    
  },
  onReady: function () {

  },
  onShow: function () {
    this.GetUserIntegral()
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
    wx.stopPullDownRefresh()
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