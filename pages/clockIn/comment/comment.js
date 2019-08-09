const $common = require('../../../utils/common.js');
const app = getApp();
Page({
  data: {
    info: {
      text: '',
      images: [],
      audio: '',
      video: '',
    },
    flag: true,  //防止连点
  },
  syncData(e) {
    console.log(e)
    this.data.info = e.detail;
  },
  cancel() { //取消
    wx.navigateBack({
      delta: 1
    });
  },
  publish() { //发表日记
    if (!this.data.flag) return;
    this.data.flag = false;
    let info = this.data.info;
    console.log(info)
    let text = info.text[0] || '';
    let audio = info.audio[0] == '' ? '':`${info.audio[0]}|${info.showTime[0]}`;
    if (text.trim().length <= 0 && !audio) {
      $common.showModal('请填写评论内容');
      this.data.flag = true;
      return;
    }
    $common.loading();
    $common.request(
      'POST',
      $common.config.InsertComment, {
        openId: wx.getStorageSync('openid'),
        CommentInfoText: text,
        CommentInfoVoice: audio,
        SmallCardActiviID: this.data.SmallCardActiviID,
        SmallCardJournalID: this.data.SmallCardJournalID,
        SmallCardThemeID: this.data.SmallCardThemeID,
      },
      (res) => {
        if (res.data.res) {
          if (+res.data.IsAudit == 0) {
            this.setData({
              scoreType: 2,
              scoreNum: +res.data.Integral
            });
            app.CommentList = res.data.Data;
          } else {
            $common.showModal('审核后自动发布', false, (data) => {
              if (data.confirm) {
                this.setData({
                  scoreType: 2,
                  scoreNum: +res.data.Integral
                });
                app.CommentList = res.data.Data;
              }
            }, "知道了")
          }
        } else {
          if (res.data.errType === 4) {
            $common.showModal('你被限制发表评论');
          } else {
            $common.showModal('评论失败');
          }
        }
      },
      (res) => {
        $common.showModal('亲~网络不给力哦，请稍后重试');
      },
      (res) => {
        this.data.flag = true;
        $common.hide();
      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.SmallCardJournalID = +options.SmallCardJournalID;
    this.data.SmallCardThemeID = +options.SmallCardThemeID;
    this.data.SmallCardActiviID = +options.SmallCardActiviID;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
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
    return $common.share()
  }
})