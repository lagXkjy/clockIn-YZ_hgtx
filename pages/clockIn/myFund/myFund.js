// pages/clockIn/myFund/myFund.js
const $common = require('../../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    pagesize: 10,
    listData:[]
  },
  withdrawal(e){
    let LfrId=e.currentTarget.dataset.lfrid
    $common.loading()
    $common.request(
      'POST',
      $common.config.UserLearnCashWithdrawal, {
        LfrId: LfrId,
        openId: wx.getStorageSync('openid'),
      },
      (res) => {
        $common.hide();
        if (res.data.res) {
          $common.showToast('提现成功')
          this.data.page = 1;
          this.data.listData = []
          this.GetUserLearnList()
        } else {
          $common.showToast('提现失败')
        }
      },
      (res) => {
        $common.showModal('亲~网络不给力哦，请稍后重试');
      },
      (res) => {
        // $common.hide();
      }
    )
  },
  GetUserLearnList(){//页面数据
    $common.loading()
    $common.request(
      'POST',
      $common.config.GetUserLearnList, {
        openId: wx.getStorageSync('openid'),
        page: this.data.page,
        pagesize: this.data.pagesize,
      },
      (res) => {
        if (res.data.res) {
          let data = res.data.LearnList;
          let listData = this.data.listData;
          listData = listData.concat(data);
          listData.forEach(value=>{
            let time = $common.timeStamp(value.LfrReceiveTime).time
            value.timer=time
          })
          this.setData({
            listData: $common.unique(listData, 'LfrId')
          });
          this.data.page++;
        } else {
          $common.showToast('获取失败，请稍后重试')
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
    this.data.page=1;
    this.data.listData=[]
    this.GetUserLearnList()
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
    this.data.page = 1;
    this.data.listData = []
    this.GetUserLearnList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.GetUserLearnList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})