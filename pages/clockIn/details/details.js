const $common = require('../../../utils/common.js');
const app = getApp();
Page({
  data: {
    pageStatus: 0, //页面状态，0 正常连接第一次进入，1 查看图片
    isNewCreate: 0, //是否是新创建的
    tabIndex: 1,
    srcForIdPhoto: $common.srcForIdPhoto,
    srcClockInImage: $common.srcClockInImage,
    srcClockInVideo: $common.srcClockInVideo,
    srcClockInAudio: $common.srcClockInAudio,
    info: null,
    pageIndex: 1,
    pageSize: 10,
    pageCount: -1,
    rakingInfo: {}, //排名信息
    rakingList: [], //排名列表
    isInvite: false, //邀请层
    ActivityID: -1, //活动id
    isAdministrator: 0, //是否是管理员身份， 0 否 1 是
    ActivityPattern:0,//是否收费 0免费 1收费 2申请
    themeInfo: {}, //该活动的信息
    dirayList: [], //日记数据
    dirayListId: null, //去评论，保存该评论下标
    pageIndexD: 1,
    pageSizeD: 5,
    pageCountD: -1,
    isGetInfo: true, //load和show重复调用
    PaymentInfo:null,//打卡活动介绍
    Jurisdiction:true,
    GetMyAvaName:'',//是否已经授权
  },
  GetMyAvaName(){
    $common.request(
      'POST',
      $common.config.GetMyAvaName, {
        OpenId: wx.getStorageSync('openid')
      },
      (res) => {
        if (res.data.res) {
          if (res.data.UserAvaUrl=='' && res.data.UserNickName==''){
            this.setData({
              GetMyAvaName:false
            })
          }else{
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
  GetUserCardJurisdiction(){//打卡权限判断
    $common.request(
      'POST',
      $common.config.GetUserCardJurisdiction, {
        OpenId: wx.getStorageSync('openid'),
        ActivityID: this.data.ActivityID
      },
      (res) => {
        if (res.data.res) {
          this.setData({Jurisdiction: res.data.IsAdopt})
          if (res.data.IsAdopt==false){
             wx.setNavigationBarTitle({
              title: '活动介绍'
            })
            this.GetPaymentInfo();
          }else{

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
  Purchase() {//点击购买
    let { ActivityPattern, ActivityID}=this.data
    wx.navigateTo({
      url: `../payment/payment?ActivityPattern=${ActivityPattern}&ActivityID=${ActivityID}`
    })
  },
  GetPaymentInfo(){//获取打卡活动介绍
    $common.loading();
    $common.request(
      'POST',
      $common.config.GetSmallCardApplyOrPaymentInf, {
        OpenId: wx.getStorageSync('openid'),
        ActivityID: this.data.ActivityID,
        IsJs:true
      },
      (res) => {
        if (res.data.res) {
          let PaymentInfo = res.data.Data;
          let text = JSON.parse(PaymentInfo.ActivityInfoText);
          let image = PaymentInfo.ActivityInfoImg.split(',');
          let audio = PaymentInfo.ActivityInfoVoice.split(',');
          let video = PaymentInfo.ActivityInfoVideo.split(',');
          let infoArr = [];
          for (let i = 0; i < 3; i++) {
            infoArr.push({
              text: text[i],
              image: image[i] && image[i].split('|')[0] ? image[i].split('|') : [],
              audio: audio[i],
              video: video[i],
            })
          }
          PaymentInfo.infoArr = infoArr;
          this.setData({
            PaymentInfo
          });
        } else {
          // $common.showModal('未知错误');
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
    let dirayList = this.data.dirayList;
    dirayList.splice(index, 1);
    this.setData({
      dirayList
    });
    this.getClockInInfo()
  },
  inviteCancel() { //邀请层，点击取消
    this.setData({
      isNewCreate: false
    })
  },
  toPublishDiary() { //去打卡
    let data = this.data;
    this.data.pageStatus = 4;
    app.clockInStatus = false;
    wx.navigateTo({
      url: `/pages/clockIn/publishDiary/publishDiary?ActivityID=${data.ActivityID}&ThemeId=${data.themeInfo.ThemeId}`,
    })
  },
  reviseTheme() { //修改主题
    let themeInfo = this.data.themeInfo;
    this.data.pageStatus = 0;
    wx.navigateTo({
      url: `/pages/clockIn/createNewTheme/createNewTheme?ThemeId=${themeInfo.ThemeId}&type=${themeInfo.ActivityType}`,
    })
  },
  toCreateNewTheme() { //跳转到新建打卡主题页
    let themeInfo = this.data.themeInfo;
    this.data.pageStatus = 0;
    wx.navigateTo({
      url: `/pages/clockIn/createNewTheme/createNewTheme?type=${themeInfo.ActivityType}&checkPoint=${themeInfo.MaxCheckpoint}&ActivityID=${this.data.ActivityID}`,
    })
  },
  tabChange(e) { //tab切换
    let index = +e.currentTarget.dataset.index;
    this.setData({
      tabIndex: index
    });
    switch (index) {
      case 0:
        this.getDiaryInfo();
        break;
      case 1:
        this.getTeaInfo();
        break;
      case 2:
        this.rakingInfo();
        break;
    }
  },
  toCheckAllTheme() { //点击全部主题
    // 0 成员 1 管理员
    let path = this.data.isAdministrator ? 'manageTheme/manageTheme' : 'checkAllTheme/checkAllTheme';
    let themeInfo = this.data.themeInfo;
    this.data.pageStatus = 0;
    wx.navigateTo({
      url: `/pages/clockIn/${path}?ActivityID=${this.data.ActivityID}&type=${themeInfo.ActivityType}&checkPoint=${themeInfo.MaxCheckpoint}`,
    })
  },
  toDataManage() { //点击管理后台
    let data = this.data;
    this.data.pageStatus = 0;
    let obj = {
      title: data.themeInfo.ActivityName,
      image: data.themeInfo.UserAvaUrl,
      name: data.themeInfo.TeaName
    }
    wx.navigateTo({
      url: `/pages/clockIn/dataManage/dataManage?ActivityID=${data.ActivityID}&title=${obj.title}&image=${obj.image}&name=${obj.name}&ActivityPattern=${data.ActivityPattern}`,
    })
  },
  getDiaryInfo() { //获取日记
    let dirayList = this.data.dirayList;
    let pageCountD = this.data.pageCountD;
    if (pageCountD !== -1 && dirayList.length >= pageCountD) return;
    if (this.data.diaryFlag) return;
    this.data.diaryFlag = true;
    $common.loading();
    $common.request(
      'POST',
      $common.config.GetSmallCardActivityDiary, {
        ActivityID: this.data.ActivityID,
        PageIndex: this.data.pageIndexD,
        PageSize: this.data.pageSizeD,
        openId: wx.getStorageSync('openid')
      },
      (res) => {
        if (res.data.res) {
          let arr = res.data.Data.ListData;
          let array = dirayList.concat(arr);
          this.setData({
            dirayList: $common.unique(array, 'Id')
          })
          this.data.pageCountD = res.data.Data.PageCount;
          this.data.pageIndexD++;
        } else {
          $common.showModal('未知错误');
        }
      },
      (res) => {
        $common.showModal('亲~网络不给力哦，请稍后重试');
      },
      (res) => {
        this.data.diaryFlag = false;
        $common.hide();
      }
    )
  },
  getTeaInfo(isReady) { //获取 活动详情
    if (!this.data.isGetInfo) return;
    this.data.isGetInfo = false;
    $common.loading();
    $common.request(
      'POST',
      $common.config.GetSmallCardActivityInfo, {
        openId: wx.getStorageSync('openid'),
        ActivityID: this.data.ActivityID
      },
      (res) => {
        if (res.data.res) {
          let info = res.data.Data;
          let text = JSON.parse(info.ActivityInfoText);
          let image = info.ActivityInfoImg.split(',');
          let audio = info.ActivityInfoVoice.split(',');
          let video = info.ActivityInfoVideo.split(',');
          let infoArr = [];
          for (let i = 0; i < 3; i++) {
            infoArr.push({
              text: text[i],
              image: image[i] && image[i].split('|')[0] ? image[i].split('|') : [],
              audio: audio[i],
              video: video[i],
            })
          }
          info.infoArr = infoArr;
          this.setData({
            info
          });
          if (isReady) { //第一次进入该页面,管理员要看详情，其他人要看评论
            let obj = { currentTarget: { dataset: { index: 0 } } }
            if (this.data.isAdministrator) { //进来是管理员显示详情，否则显示日记
              obj.currentTarget.dataset.index = 1;
              this.tabChange(obj);
            } else {
              this.tabChange(obj);
            }
          }
        } else {
          $common.showModal('未知错误');
        }
      },
      (res) => {
        $common.showModal('亲~网络不给力哦，请稍后重试');
      },
      (res) => {
        this.data.isGetInfo = true;
        $common.hide();
      }
    )
  },
  rakingInfo(isTrue) { //获取排名信息
    if (isTrue && this.data.tabIndex === 2) { //由本页面跳转打卡等等，回到本页面，且当前显示排名
      this.setData({
        rakingList: []
      });
      this.data.pageIndex = 1;
    }
    let pageCount = this.data.pageCount;
    let rakingList = this.data.rakingList;
    if (pageCount !== -1 && rakingList.length >= pageCount) return;
    $common.loading();
    $common.request(
      'POST',
      $common.config.GetSmallCardUserRanking, {
        openId: wx.getStorageSync('openid'),
        ActivityID: this.data.ActivityID,
        PageSize: this.data.pageSize,
        PageIndex: this.data.pageIndex,
      },
      (res) => {
        if (res.data.res) {
          let data = res.data.Data;
          rakingList = rakingList.concat(data.UserRankingList);
          this.setData({
            rakingInfo: data,
            rakingList
          });
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
  getClockInInfo() { //获取打卡详细信息
    $common.loading();
    $common.request(
      'POST',
      this.data.isAdministrator ? $common.config.GetTeaCurrentTheme : $common.config.GetCurrentTheme, { //管理端和用户端是不同的接口
        ActivityID: this.data.ActivityID,
        openId: wx.getStorageSync('openid')
      },
      (res) => {
        if (res.data.res) {
          let themeInfo = res.data.Dat;
          if (themeInfo.ActivityType === 1) {
            let date = $common.timeStamp(`${themeInfo.Checkpoint}000`);
            themeInfo.showTime = `${date.y}-${date.m}-${date.d}`;
          }
          this.setData({
            themeInfo,
            isAdministrator: res.data.Dat.isAdministrator
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
  init() {
    this.getTeaInfo(true);
    this.addHistory();
  },
  addHistory() { //添加浏览记录
    $common.request(
      'POST',
      $common.config.InsertActivityParticipate, {
        openId: wx.getStorageSync('openid'),
        RelationId: this.data.ActivityID,
        ParticipateType: 1
      },
      (res) => { },
      (res) => { },
      (Res) => { }
    )
  },
  checkImage(e) { //预览图片
    if (e.detail) { //本页面预览图片
      let index = e.currentTarget.dataset.index;
      let indexs = e.currentTarget.dataset.indexs;
      let infoArr = this.data.info.infoArr;
      let current = infoArr[index].image[indexs];
      let urls = [];
      for (let i = 0, len = infoArr.length; i < len; i++) {
        for (let j = 0, l = infoArr[i].image.length; j < l; j++) {
          urls.push(`${this.data.srcClockInImage}${infoArr[i].image[j]}`);
        }
      }
      wx.previewImage({
        current, // 当前显示图片的http链接
        urls // 需要预览的图片http链接列表
      })
    }
    this.data.pageStatus = 1;
  },
  syncPraiseData(e) { //同步点赞数据
    let index = e.currentTarget.dataset.index;
    let dirayList = this.data.dirayList;
    let obj = e.detail;
    dirayList[index].IsFabulous = obj.IsFabulous;
    dirayList[index].FabulousList = obj.FabulousList;
    this.data.dirayList = dirayList;
  },
  syncComment(e) { //点击评论
    let index = e.currentTarget.dataset.index;
    let dirayList = this.data.dirayList
    this.data.dirayListId = dirayList[index].Id
    app.CommentList = null;
    this.data.pageStatus = 3;
  },
  syncCommentData() { //同步评论数据
    if (!app.CommentList) return;
    let { dirayList, dirayListId } = this.data
    let index = -1
    for (let i = 0, len = dirayList.length; i < len; i++) {
      if (dirayList[i].Id === dirayListId) {
        index = i
        break
      }
    }
    if (index === -1) return app.CommentList = null;
    let key = `dirayList[${index}].CommentList`
    this.setData({ [key]: app.CommentList })
    app.CommentList = null;
    this.data.dirayListId = null;
  },
  getPosterData() { //获取海报数据
    if (!app.clockInStatus) return;
    $common.loading();
    $common.request(
      'POST',
      $common.config.GetPosterImageInfo, {
        ActivityID: this.data.ActivityID,
        openId: wx.getStorageSync('openid')
      },
      (res) => {
        if (res.data.res) {
          this.setData({
            posterData: res.data.Data
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
  onLoad: function (options) {
    this.GetMyAvaName()
    let isNewCreate = +options.isNewCreate || 0; //是否是新创建的，有个弹框
    this.setData({
      isAdministrator: +options.isAdministrator,
      isNewCreate,
      ActivityID: +options.ActivityID,
      ActivityPattern: +options.ActivityPattern,
      IsParticipate: +options.IsParticipate,
    });
    $common.getOpenid(this.init)
    this.GetUserCardJurisdiction();
  },
  onReady: function () {

  },
  checkStatus() { //根据本页隐藏状态判断显示后处理方式
    let pageStatus = this.data.pageStatus;
    switch (pageStatus) {
      case 0: //正常链接进入
        this.getClockInInfo();
        this.getTeaInfo();
        // 从主题详情页也可以打卡，人家要刷新，我tm的搞什么性能
        this.setData({
          dirayList: [], //日记数据
          pageIndexD: 1,
          pageSizeD: 5,
          pageCountD: -1,
        });
        this.getDiaryInfo();
        break;
      case 1: //查看图片
        break;
      case 2: //分享
        this.rakingInfo(true);
        break;
      case 3: //评论
        this.syncCommentData();
        break;
      case 4: //打卡
        this.setData({
          dirayList: [], //日记数据
          pageIndexD: 1,
          pageSizeD: 5,
          pageCountD: -1,
        });
        this.getClockInInfo();
        this.getDiaryInfo();
        this.rakingInfo(true);
        this.getPosterData();
        break;
    }
  },
  onShow() {
    this.checkStatus();
    this.GetUserCardJurisdiction()
  },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    this.getClockInInfo();
    let tabIndex = this.data.tabIndex;
    if (tabIndex === 0) { //日记
      this.setData({
        dirayList: [], //日记数据
        pageIndexD: 1,
        pageSizeD: 5,
        pageCountD: -1,
      });
      this.getDiaryInfo();
    } else if (tabIndex === 1) { //详情
      this.getTeaInfo();
    } else if (tabIndex === 2) { //排名
      this.setData({
        pageIndex: 1,
        pageSize: 10,
        pageCount: -1,
        rakingList: [], //排名列表
      });
      this.rakingInfo();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let tabIndex = this.data.tabIndex;
    if (tabIndex === 0) { //日记
      this.getDiaryInfo();
    } else if (tabIndex === 2) { //排名
      this.rakingInfo();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log(res)
    this.data.pageStatus = 2;
    let share = res.target && res.target.dataset && res.target.dataset.share;
    let url = '';
    let data = [];
    if (res.from === 'button') {
      url = `/pages/clockIn/thisRecord/thisRecord`
      data = [{ key: 'JournalID', value: res.target.dataset.journalid }, { key: 'ActivityPattern', value: this.data.ActivityPattern }]
    } else {
      url = `/pages/clockIn/details/details`
      data = [{ key: 'ActivityID', value: this.data.ActivityID }, { key: 'isAdministrator', value: this.data.isAdministrator }, { key: 'ActivityPattern', value: this.data.ActivityPattern }]
    }
    if (share) {
      url = `/pages/clockIn/details/details`
      data = [{ key: 'ActivityID', value: this.data.ActivityID }, { key: 'isAdministrator', value: this.data.isAdministrator }, { key: 'ActivityPattern', value: this.data.ActivityPattern }]
    }
    // let path = res.from === 'button' ? `/pages/clockIn/thisRecord/thisRecord?JournalID=${res.target.dataset.journalid}` :
    //   `/pages/clockIn/details/details?ActivityID=${this.data.ActivityID}&isAdministrator=${this.data.isAdministrator}`;
    // if (share) path = `/pages/clockIn/details/details?ActivityID=${this.data.ActivityID}&isAdministrator=${this.data.isAdministrator}`;
    let path = `/pages/login/login?url=${url}&data=${JSON.stringify(data)}`
    return $common.share(path, () => {
      $common.request(
        'POST',
        $common.config.InsertShare, {
          openid: wx.getStorageSync('openid'),
          ActivityID: this.data.ActivityID || 0,
          ThemeID: res.target.dataset.ThemeId || this.data.themeInfo.ThemeId,
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
        (res) => { },
        (res) => { }
      )
    })
  }
})