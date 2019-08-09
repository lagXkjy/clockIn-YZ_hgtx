// pages/clockIn/Purchase/Purchase.js
const $common = require('../../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null,
    isGetInfo: true, //load和show重复调用
    ActivityID: 3012, //活动id
  },
  Purchase(){
    wx.navigateTo({
      url: '../payment/payment',
    })
  },
  getTeaInfo() { //获取 活动详情
    if (!this.data.isGetInfo) return;
    this.data.isGetInfo = false;
    $common.loading();
    $common.request(
      'POST',
      $common.config.GetSmallCardActivityInfo, {
        openId: wx.getStorageSync('openid'),
        ActivityID: this.data.ActivityID
      },
      (res) => {
        if (res.data.res) {
          let info = res.data.Data;
          let text = JSON.parse(info.ActivityInfoText);
          let image = info.ActivityInfoImg.split(',');
          let audio = info.ActivityInfoVoice.split(',');
          let video = info.ActivityInfoVideo.split(',');
          let infoArr = [];
          for (let i = 0; i < 3; i++) {
            infoArr.push({
              text: text[i],
              image: image[i] && image[i].split('|')[0] ? image[i].split('|') : [],
              audio: audio[i],
              video: video[i],
            })
          }
          info.infoArr = infoArr;
          this.setData({
            info
          });
        } else {
          $common.showModal('未知错误');
        }
      },
      (res) => {
        $common.showModal('亲~网络不给力哦，请稍后重试');
      },
      (res) => {
        this.data.isGetInfo = true;
        $common.hide();
      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTeaInfo()
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

  }
})