// pages/clockIn/Answer/Answer.js
const $common = require('../../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subscript:0,
    UasId:'',//试卷id
    listData:[],
  },
  previous() { //上一题
    this.data.subscript--
    this.setData({
      subscript: this.data.subscript
    })
  },
  Next() { //下一题
    if (this.data.subscript != this.data.listData.length-1){
      this.data.subscript++
      this.setData({
        subscript: this.data.subscript
      })
    }
  },
  GetUserAnswerChilds(){
    $common.loading()
    $common.request(
      'POST',
      $common.config.GetUserAnswerChilds, {
        UasId: this.data.UasId
      },
      (res) => {
        if (res.data.res) {
          let AnswerChilds = res.data.AnswerChilds
          AnswerChilds.forEach(item => {
            item.UascOptions = JSON.parse(item.UascOptions)
            item.UascOptions.forEach(value => {
              if (item)
              item.checked = false
            })
          })
          this.setData({
            listData: res.data.AnswerChilds
          });
        } else {
          $common.showToast('提交失败，请稍后重试')
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
    wx.setNavigationBarTitle({
      title: options.title,
    })
    this.setData({
      UasId: +options.UasId
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
    this.GetUserAnswerChilds()
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