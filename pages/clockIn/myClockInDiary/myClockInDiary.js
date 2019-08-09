const $common = require('../../../utils/common.js');
Page({
  data: {
    listData: [],
    pageIndex: 1,
    pageSize: 5,
    pageCount: -1,
    GetMyAvaName:''
  },
  GetMyAvaName() {
    $common.request(
      'POST',
      $common.config.GetMyAvaName, {
        OpenId: wx.getStorageSync('openid')
      },
      (res) => {
        if (res.data.res) {
          if (res.data.UserAvaUrl == '' && res.data.UserNickName == '') {
            this.setData({
              GetMyAvaName: false
            })
          } else {
            this.setData({
              GetMyAvaName: true
            })
          }
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
  deleteDiary(e) { //删除日记
    let index = e.currentTarget.dataset.index;
    let listData = this.data.listData;
    listData.splice(index, 1);
    this.setData({
      listData
    });
  },
  init() {
    let listData = this.data.listData;
    let pageCount = this.data.pageCount;
    if (pageCount !== -1 && pageCount <= listData.length) return;
    $common.loading();
    $common.request(
      'POST',
      $common.config.GetUserSmallCardJournal, {
        openId: wx.getStorageSync('openid'),
        PageIndex: this.data.pageIndex,
        PageSize: this.data.pageSize
      },
      (res) => {
        if (res.data.res) {
          let data = res.data.Data;
          let arr = data.UserJournal;
          listData = listData.concat(arr);
          this.setData({
            listData
          })
          this.data.pageCount = data.PageCount;
          this.data.pageIndex++;
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
  onLoad: function(options) {
    this.GetMyAvaName()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  onShow: function() {
    this.setData({
      listData: [],
      pageIndex: 1,
      pageSize: 5,
      pageCount: -1,
    });
    this.init();
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
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.init();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    this.data.pageStatus = 2;
    if (res.from === 'button') { // 来自页面内转发按钮
      let url = `/pages/clockIn/thisRecord/thisRecord`
      let data = [{ key: 'JournalID', value: res.target.dataset.journalid }]
      let path = `/pages/login/login?url=${url}&data=${JSON.stringify(data)}`
      return $common.share(path, () => {
        $common.request(
          'POST',
          $common.config.InsertShare, {
            openid: wx.getStorageSync('openid'),
            ActivityID: this.data.ActivityID || 0,
            ThemeID: res.target.dataset.ThemeId,
            JournalID: res.target.dataset.journalid || 0
          },
          (res) => {
            if (res.data.res) {
              this.setData({
                // isNewCreate: false,
                scoreType: 3,
                scoreNum: +res.data.Integral
              });
            }
          },
          (res) => {},
          (res) => {}
        )
      })
    } else {
      return $common.share()
    }

  }
})