// pages/clockIn/IntegralSettings/IntegralSettings.js
const $common = require('../../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // Punch :5,//打卡
    // thumbsup:5,//点赞
    // thumbsuplimit:100,//点赞上限
    // comment:5,//评论
    // commentlimit:5,//评论上限
    // share:5,//分享积分
    // sharelimit:5,//分享上限
    ActivityID:'',
    listData:{},
  },
  toast(str) {
    $common.showToast(`请完善${str}`)
  },
  Submission(data) { //判断所填信息是否完善
    let t = $common.trim(data)
    console.log(data)
    switch (false) {
      case t('Punch'):
        return this.toast('打卡积分');
        break
      case t('thumbsup'):
        return this.toast('点赞积分');
        break
      case t('thumbsuplimit'):
        return this.toast('点赞积分上限');
        break
      case t('comment'):
        return this.toast('评论积分');
        break
      case t('commentlimit'):
        return this.toast('评论积分上限');
        break
      case t('share'):
        return this.toast('分享积分');
        break
      case t('sharelimit'):
        return this.toast('分享积分上限');
        break
      default:
        return true
    }
  },
  formSubmit(e) {//提交
    let data = e.detail.value
    if (!this.Submission(data)) return
    $common.loading();
    $common.request(
      'POST',
      $common.config.PutActivityRule, {
        AtyID: this.data.ActivityID,
        ActivityCardIntegral: data.Punch,
        ActivityFabulousIntegral: data.thumbsup,
        ActivityCommentIntegral: data.comment,
        ActivityShareIntegral: data.share,
        ActivityFabulousUpperLimit: data.thumbsuplimit,
        ActivityCommentUpperLimit: data.commentlimit,
        ActivityShareUpperLimit: data.sharelimit,
      },
      (res) => {
        if (res.data.res) {
          $common.showModal(`设置成功`,false,res=>{
            wx.navigateBack({
              delta: 1
            })
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
    console.log(e.detail.value)
  },
  GetActivityRule() { //获取活动积分规则信息
    $common.loading();
    $common.request(
      'POST',
      $common.config.GetActivityRule, {
        AtyID: this.data.ActivityID
      },
      (res) => {
        if (res.data.res) {
          this.setData({
            listData: res.data.AtyRule
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
    this.data.ActivityID = options.ActivityID
    this.GetActivityRule()
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