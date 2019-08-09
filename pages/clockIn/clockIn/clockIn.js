const $common = require('../../../utils/common.js');
const app = getApp();
Page({
  data: {
    srcClockInImage: $common.srcClockInImage,
    srcBanner: $common.srcBanner,
    pageIndex: 1,
    pageSize: 10,
    isAuthority: 0, //是否有新建打卡的资格 0 无 1 有
    listData: [],
    // 轮播
    imgs: [],
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔
    duration: 1000, //滑动动画时长
    inputShowed: false,
    inputVal: ""
    // end
  },
  createClockIn() { //新建打卡活动
    wx.navigateTo({
      url: '/pages/clockIn/createNew/createNew',
    })
  },
  toDetails(e) { //跳转到打卡详情页
    let index = e.currentTarget.dataset.index;
    let listData = this.data.listData;
    wx.navigateTo({
      url: `/pages/clockIn/details/details?ActivityID=${listData[index].Id}&isAdministrator=${listData[index].isAdministrator}&ActivityPattern=${listData[index].ActivityPattern}&IsParticipate=${listData[index].IsParticipate}`,
    })
  },
  getData() { //获取本页面数据
    $common.loading();
    $common.request('POST', $common.config.GetRotationChartImgs, {},
      (res) => {
        if (res) {
          this.setData({
            imgs: res.data.Imgs
          })
        }
      }
    )
    $common.request(
      'POST',
      $common.config.GetSmallCardActivity, {
        openId: wx.getStorageSync('openid'),
        PageIndex: this.data.pageIndex,
        PageSize: this.data.pageSize,
      },
      (res) => {
        if (res.data.res) {
          let data = res.data.Data;
          let listData = this.data.listData;
          listData = listData.concat(data.ListData);
          this.setData({
            isAuthority: data.isAuthority,
            listData: $common.unique(listData, 'Id')
          });
          this.data.pageIndex++;
        }
      },
      (res) => {},
      (res) => {
        $common.hide();
      }
    )
  },
  init() {
    $common.getOpenid(this.getData)
  },
  onLoad: function(options) {},
  onReady: function() {},
  onShow: function() {
    this.data.pageIndex = 1
    this.data.listData = []
    this.init()
  },
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
    this.data.pageIndex = 1
    this.data.listData = []
    this.init()
  },
  onReachBottom: function() {
    this.init()
  },
  onShareAppMessage: function() {
    return $common.share()
  }
})