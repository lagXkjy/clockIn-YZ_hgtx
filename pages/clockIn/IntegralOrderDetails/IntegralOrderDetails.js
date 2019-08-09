// pages/clockIn/IntegralOrderDetails/IntegralOrderDetails.js
const $common = require('../../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    srcImg: $common.CommodityImg,
    IoId:'',
    orderdata:{},
  },
  logistics(){//跳转查看物流
    wx.navigateTo({
      url: `../logistics/logistics?IoId=${this.data.orderdata.IoId}`,
    })
  },
  GetIntegralOrderDetails() {//获取订单列表
    $common.loading();
    $common.request(
      'POST',
      $common.config.GetIntegralOrderDetails, {
        IoId: this.data.IoId,
      },
      (res) => {
        if (res.data.res) {
          $common.hide();
          let data = res.data.OrderDetails
          data.IoPurchaseTime = $common.timeStamp(data.IoPurchaseTime).time
          this.setData({
            orderdata: data
          })
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
  onLoad: function (options) {
    this.setData({
      IoId: +options.IoId
    })
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
    this.GetIntegralOrderDetails()
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