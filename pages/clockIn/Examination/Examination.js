// pages/clockIn/Examination/Examination.js
const $common = require('../../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: $common.ExaminationImg,
      listData:[],
    page:1,
    pagesize:10,
  },
  GetTestPaperList(){
    $common.loading();
    $common.request(
      'POST',
      $common.config.GetTestPaperList, {
        openId: wx.getStorageSync('openid'),
        page: this.data.page,
        pagesize: this.data.pagesize,
      },
      (res) => {
        if (res.data.res) {
          let data = res.data.TestPapers;
          let listData = this.data.listData;
          listData = listData.concat(data);
          this.setData({
            listData: $common.unique(listData, 'TpId')
          });
          this.data.page++;
        } else {
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
  participate(e){
    let title=e.currentTarget.dataset.title
    let TpExplain = e.currentTarget.dataset.tpexplain
    let TpId = e.currentTarget.dataset.tpid
    wx.navigateTo({
      url: `../questions/questions?title=${title}&TpExplain=${TpExplain}&TpId=${TpId}`,
    })
  },
  init() {
    $common.getOpenid(this.GetTestPaperList)
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
    this.data.page=1
    this.data.listData=[]
    this.init()
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
    this.data.page = 1
    this.data.listData = []
    this.init()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.init()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})