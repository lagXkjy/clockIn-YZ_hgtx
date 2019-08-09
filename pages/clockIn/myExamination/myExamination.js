// pages/clockIn/myExamination/myExamination.js
const $common = require('../../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: $common.ExaminationImg,
    page:1,
    pagesize:10,
    listData: []
  },
  Answer(e){
    let title=e.currentTarget.dataset.title
    let UasId = e.currentTarget.dataset.uasid
    wx.navigateTo({
      url: `../Answer/Answer?title=${title}&UasId=${UasId}`,
    })
  },
  GetUserAnswerList(){
    $common.loading()
    $common.request(
      'POST',
      $common.config.GetUserAnswerList, {
        openId: wx.getStorageSync('openid'),
        page: this.data.page,
        pagesize:this.data.pagesize,
      },
      (res) => {
        if (res.data.res) {
          let data = res.data.UserAnswerList;
          let listData = this.data.listData;
          listData = listData.concat(data);
          this.setData({
            listData: $common.unique(listData, 'UasId')
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
    this.data.listData=[];
    this.GetUserAnswerList()
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
    this.GetUserAnswerList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.GetUserAnswerList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})