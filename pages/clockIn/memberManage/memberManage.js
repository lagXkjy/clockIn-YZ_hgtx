const $common = require('../../../utils/common.js');
Page({
  data: {
    ActivityID: -1,
    input: '',
    listData: [],
    pageIndex: 1,
    pageSize: 10,
    pageCount: -1,
    activeindex: 0,
    ActivityPattern: 0, //是否收费
  },
  active(e) { //审核状态
    console.log(e.currentTarget.dataset.index)
    this.setData({
      activeindex: e.currentTarget.dataset.index,
      listData:[]
    })
    this.data.pageIndex = 1;
    this.data.pageCount = -1;
    this.getData()
  },
  UpdateUserApplyState(e) { //是否通过
    let index = e.currentTarget.dataset.index;
    let listData = this.data.listData;
    $common.loading();
    $common.request(
      'POST',
      $common.config.UpdateUserApplyState, {
        UserId: listData[index].StuUserId,
        // type: listData[index].SmallCardLimit
        actid: this.data.ActivityID,
        ApplyState: +this.data.activeindex
      },
      (res) => {
        if (res.data.res) {
          this.setData({
            listData: []
          })
          this.data.pageCount = -1;
          this.data.pageIndex = 1;
          this.getData()
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
  changeAuthority(e) { //切换状态
    let index = e.currentTarget.dataset.index;
    let listData = this.data.listData;
    $common.loading();
    $common.request(
      'POST',
      $common.config.UpdateUserLimit, {
        StuId: listData[index].StuUserId,
        // type: listData[index].SmallCardLimit
        actid: this.data.ActivityID
      },
      (res) => {
        if (res.data.res) {
          if (listData[index].SmallCardLimit === 0) {
            listData[index].SmallCardLimit = 1;
          } else {
            listData[index].SmallCardLimit = 0;
          }
          this.setData({
            listData
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
  inputchange(e) {
    this.data.input = e.detail;
    this.setData({
      listData: []
    });
    this.data.pageIndex = 1;
    this.data.pageCount = -1;
    this.getData();
  },
  getData() { //获取数据
    let listData = this.data.listData;
    let pageCount = this.data.pageCount;
    if (pageCount !== -1 && listData.length >= pageCount) return;
    $common.loading();
    $common.request(
      'POST',
      $common.config.GetSmallCardActivityUserList, {
        ActivityID: this.data.ActivityID,
        Seach: this.data.input,
        PageIndex: this.data.pageIndex,
        PageSize: this.data.pageSize,
        ApplyState: this.data.ActivityPattern != 2 ? '-2' : +this.data.activeindex,
      },
      (res) => {
        if (res.data.res) {
          let arr = res.data.Data.UserList;
          for (let i = 0, len = arr.length; i < len; i++) {
            let d = $common.timeStamp(arr[i].ParticipateDate);
            arr[i].showTime = `${d.y}-${d.m}-${d.d}`;
          }
          listData = listData.concat(arr);
          this.setData({
            listData
          })
          this.data.pageCount = res.data.Data.PageCount;
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
    this.setData({
      ActivityID: +options.ActivityID,
      ActivityPattern: +options.ActivityPattern,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getData();
  },
  onShow: function() {},

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
    this.getData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return $common.share()
  }
})