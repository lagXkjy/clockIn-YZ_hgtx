// pages/clockIn/payment/payment.js
const $common = require('../../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    srcImg: $common.CommodityImg,
    IcId:'',
    name: '', //姓名
    phone: '', //手机号
    address:'',//地址
    IcCommodityType:'',//是否是虚拟物品
    orderData:{},
  },
  name(e) { //名字
    this.setData({
      name: e.detail.value
    })
  },
  phone(e) { //手机号
    this.setData({
      phone: e.detail.value
    })
  },
  address(e) { //手机号
    this.setData({
      address: e.detail.value
    })
  },
  payment() { //确认提交 付款
    let that = this
    let {
      phone,
      name, address, IcCommodityType
    } = that.data
    if (name == '') {
      $common.showModal('姓名不能为空')
    } else if ($common.phoneReg.test(phone) == false) {
      $common.showModal('请填写正确手机号')
    } else if (address == '' && IcCommodityType==0){
      $common.showModal('请填写收货地址')
    }else {
      wx.setStorageSync('address', address)
      $common.loading('正在提交')
      $common.request(
        'POST',
        $common.config.PushIntegralOrder, {
          openId: wx.getStorageSync('openid'),
          IcId: that.data.IcId,
          UserName: that.data.name,
          UserPhone: that.data.phone,
          UserAddress: that.data.address
        },
        (res) => {
          if (res.data.res) {
            wx.redirectTo({
              url: '../Successful/Successful',
            })
          } else {
            if (res.data.errType==2){
              $common.showModal('您的积分不够哦');
            }else{
              $common.showModal('未知错误');
            }
          }
        },
        (res) => {
          $common.showModal('亲~网络不给力哦，请稍后重试');
        },
        (res) => {
          $common.hide();
        }
      )
    }
  },
  GetConfirmOrderInfo(){
    $common.loading();
    $common.request(
      'POST',
      $common.config.GetConfirmOrderInfo, {
        OpenId: wx.getStorageSync('openid'),
        IcId: this.data.IcId
      },
      (res) => {
        if (res.data.res) {
            this.setData({
              name: res.data.DataInfo.UserName,
              phone: res.data.DataInfo.UserPhone,
              orderData: res.data.DataInfo
            })
        } else {
          $common.showModal('未知错误');
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let address = wx.getStorageSync('address')
    this.setData({
      address: address == '' ? '' : address,
      IcId: +options.IcId,
      IcCommodityType: +options.IcCommodityType
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
    this.GetConfirmOrderInfo()
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