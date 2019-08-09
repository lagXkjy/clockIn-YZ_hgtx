// pages/clockIn/Integraldetails/Integraldetails.js
const $common = require('../../../utils/common.js');
const WxParse = require('../../../wxParse/wxParse.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    srcImg: $common.CommodityImg,
    IcId:'',
    listData:{},
    Hei:'',
  },
  imgH(e) {
    let winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
    let winHit = wx.getSystemInfoSync().windowHeight; //获取当前屏幕的高度
    let imgh = e.detail.height; //图片高度
    let imgw = e.detail.width;
    let swiperH = winWid * imgh / imgw + "px";
    //等比设置swiper的高度。  即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度    ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
    this.setData({
      Hei: swiperH, //设置高度
      winHit: winHit + 'px',
    })
  },
  acknowledgement(){
    wx.navigateTo({
      url: `../acknowledgement/acknowledgement?IcId=${this.data.IcId}&IcCommodityType=${this.data.listData.IcCommodityType}`,
    })
  },
  GetCommodityDetails() {
    $common.loading();
    $common.request(
      'POST',
      $common.config.GetCommodityDetails, {
        IcId: this.data.IcId,
      },
      (res) => {
        if (res.data.res) {
          $common.hide();
          let data = res.data.Details;
          data.IcMasterMap=data.IcMasterMap.split(',')
          this.setData({
            listData: data
          })
          WxParse.wxParse('article', 'html', data.IcDetails, this, 0);
        }
      },
      (res) => { },
      (res) => {
        $common.hide();
      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      IcId: +options.IcId
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
    this.GetCommodityDetails()
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
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
    this.GetCommodityDetails()
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

  }
})