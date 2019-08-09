// pages/clockIn/IntegralMall/IntegralMall.js
const $common = require('../../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    srcImg: $common.CommodityImg,
    page:1,//礼品page
    pagesize: 10,//礼品page
    orderpagesize: 10,//订单page
    orderpage: 1,//订单page
    activeindex: 0,
    listData: [],
    order:[],
    Banners:[],
  },
  logistics(e) {//跳转查看物流
    let IoId = e.currentTarget.dataset.ioid
    wx.navigateTo({
      url: `../logistics/logistics?IoId=${IoId}`,
    })
  },
  Repurchase(e){//再次购买
    let IoId = e.currentTarget.dataset.ioid
    let IoIcCommodityType = e.currentTarget.dataset.ioiccommoditytype
    wx.navigateTo({
      url: `../acknowledgement/acknowledgement?IcId=${IoId}&IcCommodityType=${IoIcCommodityType}`,
    })
  },
  confirm(e) {//确认收货
    let IoId = e.currentTarget.dataset.ioid
    $common.loading();
    $common.request(
      'POST',
      $common.config.PostReceivingGoods, {
        IoId:IoId
      },
      (res) => {
        if (res.data.res) {
          $common.hide();
          this.data.orderpage = 1;
          this.data.order = [];
          this.GetIntegralOrderList()
        }
      },
      (res) => { },
      (res) => {
        $common.hide();
      }
    )
  },
  IntegralOrderDetails(e){//查看物流
    let IoId=e.currentTarget.dataset.ioid
    wx.navigateTo({
      url: `../IntegralOrderDetails/IntegralOrderDetails?IoId=${IoId}`,
    })
  },
  Integraldetails(e) { //跳转积分详情页
    let IcId=e.currentTarget.dataset.icid;
    wx.navigateTo({
      url: `../Integraldetails/Integraldetails?IcId=${IcId}`,
    })
  },
  seeindex() { //跳转首页
    this.setData({
      activeindex: 0
    })
  },
  activeclick(e) { //tabbar
    let index = +e.currentTarget.dataset.activeindex
    this.setData({
      activeindex: index
    })
    if (index == 0) {
      this.data.page = 1;
      this.data.listData = [];
      this.GetCommodityList()
    } else {
      this.data.orderpage = 1;
      this.data.order = [];
      this.GetIntegralOrderList()
    }
  },
  GetIntegralBanners(){//获取轮播图
    $common.loading();
    $common.request(
      'POST',
      $common.config.GetIntegralBanners, {
      },
      (res) => {
        if (res.data.res) {
          let Banners = res.data.Banners.split(',')
          this.setData({
            Banners
          })
        }
      },
      (res) => { },
      (res) => {
        $common.hide();
      }
    )
  },
  GetIntegralOrderList(){//获取订单列表
    $common.loading();
    $common.request(
      'POST',
      $common.config.GetIntegralOrderList, {
        page: this.data.orderpage,
        pagesize: this.data.orderpagesize,
        OpenId: wx.getStorageSync('openid'),
      },
      (res) => {
        if (res.data.res) {
          $common.hide();
          let data = res.data.DataList;
          let order = this.data.order;
          order = order.concat(data);
          this.setData({
            order: $common.unique(order, 'IoId')
          });
          this.data.orderpage++;
        }
      },
      (res) => { },
      (res) => {
        $common.hide();
      }
    )
  },
  GetCommodityList(){//获取商品列表
    $common.loading();
    $common.request(
      'POST',
      $common.config.GetCommodityList, {
        page: this.data.page,
        pagesize: this.data.pagesize,
      },
      (res) => {
        if (res.data.res) {
          $common.hide();
          let data = res.data.DataList;
          let listData = this.data.listData;
          listData = listData.concat(data);
          this.setData({
            listData: $common.unique(listData, 'IcId')
          });
          this.data.page++;
        }
      },
      (res) => { },
      (res) => {
        $common.hide();
      }
    )
  },
  init(){
    if (+this.data.activeindex == 0) {
      this.data.page = 1;
      this.data.listData = [];
      this.GetCommodityList()
    } else {
      this.data.orderpage = 1;
      this.data.order = [];
      this.GetIntegralOrderList()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.GetIntegralBanners()
    this.setData({
      activeindex: options.activeindex == undefined?0:+options.activeindex
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
    this.init()
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
    wx.stopPullDownRefresh()
    this.init()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (+this.data.activeindex==0){
      this.GetCommodityList()
    }else{
      this.GetIntegralOrderList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})