const $common = require('../../../utils/common.js');
Page({
  data: {
    srcClockInCatch: $common.srcClockInCatch,
    srcClockInImage: $common.srcClockInImage,
    activeName: '',
    headImage: '',
    clockInType: 0,
    PatternType: 0,
    Price: '', //收费价格
    info: {
      text: [],
      images: [],
      audio: [],
      video: [],
      file: []
    },
    flag: true, //防止连点
  },
  inputEvent(e) { //打卡名称
    this.data.activeName = e.detail.value
  },
  chooseHeadImage() { //选择活动头图
    $common.chooseImage((res) => {
      let headImage = res.tempFilePaths[0];
      $common.loading(2)
      wx.uploadFile({
        url: $common.config.UpLoadImg,
        filePath: headImage,
        name: 'file',
        formData: {
          Type: 1
        },
        success: (res) => {
          let data = JSON.parse(res.data);
          if (data.res) { //上传成功
            this.setData({
              headImageR: '',
              headImage: {
                url: data.msg
              }
            })
          } else { //上传失败
            $common.showModal('上传失败');
          }
        },
        fail: (res) => {
          $common.showModal('上传失败');
        },
        complete: (res) => {
          $common.hide();
        }
      })
    }, 1);
  },
  PatternCheck(e) { //选择打卡模式
    this.setData({
      PatternType: +e.currentTarget.dataset.index
    });
  },
  radioCheck(e) { //选择打卡类型
    this.setData({
      clockInType: +e.currentTarget.dataset.index
    });
  },
  syncData(e) { //同步组件数据
    this.data.info = e.detail;
  },
  price(e) { //收费价格
    this.data.Price = e.detail.value
  },
  toDetail() { //创建成功后跳转到详情页
    if (!this.data.flag) return;
    this.data.flag = false;
    let ActivityName = this.data.activeName,
      ActivityHeadImage = this.data.headImage,
      ActivityType = this.data.clockInType + 1,
      Price = +this.data.Price,
      PatternType = this.data.PatternType;


    if (ActivityName.trim().length <= 0) {
      $common.showModal('请填写活动名称');
      this.data.flag = true;
      return;
    }
    if (!ActivityHeadImage.url) {
      $common.showModal('请上传活动头图');
      this.data.flag = true;
      return;
    }
    if (PatternType == 1 && Price == '') {
      $common.showModal('请填写收费价格');
      this.data.flag = true;
      return;
    }
    if (PatternType == 1 && !(/(^[1-9]\d*$)/.test(Price))) {
      $common.showModal('价格不可以为小数');
    }

    let info = this.data.info;
    let infoFlag = false;
    for (let i = 0; i < 3; i++) {
      if (info.text[i] || info.images[i] || info.audio[i] || info.video[i] || info.file[i]) {
        infoFlag = true;
        break;
      }
    }
    if (!infoFlag) {
      $common.showModal('请添加活动内容');
      this.data.flag = true;
      return;
    }
    for (let i in info.audio) {
      if (info.audio[i] != '') {
        info.audio[i] = `${info.audio[i]}|${info.showTime[i]}`
      }
    }
    $common.request(
      'POST',
      $common.config.InsertActivities, {
        ActivityName,
        ActivityHeadImage: ActivityHeadImage.url,
        ActivityType,
        ActivityInfoText: info.text,
        ActivityInfoImg: info.images,
        ActivityInfoVoice: info.audio,
        ActivityInfoVideo: info.video,
        openId: wx.getStorageSync('openid'),
        ActivityPattern: PatternType,
        ActivityPrice: Price,

      },
      (res) => {
        console.log(PatternType)
        if (res.data.res) { //创建成功
          if (+res.data.IsAudit == 0) {
            wx.redirectTo({
              url: `/pages/clockIn/details/details?ActivityID=${res.data.Id}&isAdministrator=1&isNewCreate=1&ActivityPattern=${PatternType}`,
            })
          } else {
            $common.showModal('审核后自动发布', false, (res) => {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            },"知道了")
          }
        } else {
          $common.showModal('添加失败');
        }
      },
      (res) => {
        $common.showModal('添加失败');
      },
      (res) => {
        this.data.flag = true;
      }
    )
  },
  reverse() { //修改活动
    if (!this.data.flag) return;
    this.data.flag = false;
    let ActivityName = this.data.activeName,
      ActivityHeadImage = this.data.headImage,
      ActivityType = this.data.clockInType + 1,
      Price = this.data.Price,
      PatternType = this.data.PatternType;
    if (ActivityName.trim().length <= 0) {
      $common.showModal('请填写活动名称');
      this.data.flag = true;
      return;
    }
    if (!ActivityHeadImage.url) {
      $common.showModal('请上传活动头图');
      this.data.flag = true;
      return;
    }
    if (PatternType == 1 && Price == '') {
      $common.showModal('请填写收费价格');
      this.data.flag = true;
      return;
    }
    let info = this.data.info;
    let infoFlag = false;
    for (let i = 0; i < 3; i++) {
      if (info.text[i] || info.images[i] || info.audio[i] || info.video[i]) {
        infoFlag = true;
        break;
      }
    }
    if (!infoFlag) {
      $common.showModal('请添加活动内容');
      this.data.flag = true;
      return;
    }
    $common.request(
      'POST',
      $common.config.UpdateActivities, {
        ActivityID: this.data.ActivityID,
        ActivityHeadImage: ActivityHeadImage.url,
        ActivityInfoImg: info.images,
        ActivityInfoText: info.text,
        ActivityInfoVideo: info.video,
        ActivityInfoVoice: info.audio,
        ActivityName,
        openId: wx.getStorageSync('openid')
      },
      (res) => {
        if (res.data.res) { //修改成功
          wx.navigateBack({
            delta: 1
          })
        } else {
          $common.showModal('修改失败');
        }
      },
      (res) => {
        $common.showModal('修改失败');
      },
      (res) => {
        this.data.flag = true;
      }
    )
  },
  stopPlay() { //页面隐藏或卸载后停止录音和播放
    this.setData({
      stopPlay: true
    })
  },
  getActivityData() { //修改活动信息前，获取活动信息
    $common.request(
      'POST',
      $common.config.GetActivitiesInfo, {
        ActivityID: this.data.ActivityID
      },
      (res) => {
        if (res.data.res) {
          let options = res.data.Data;
          let themeInfoData = {
            text: options.ActivityInfoText,
            images: options.ActivityInfoImg,
            audio: options.ActivityInfoVoice,
            video: options.ActivityInfoVideo
          }
          this.setData({
            activeName: options.ActivityName,
            headImage: {
              url: options.ActivityHeadImage,
              isRevise: true
            },
            clockInType: +options.ActivityType - 1,
            themeInfoData,
          });
          this.data.info = { //修改的时候，若什么内容都没有改发请求的情况，需要提前中转为所需格式
            text: JSON.parse(themeInfoData.text),
            images: themeInfoData.images.split(','),
            audio: themeInfoData.audio.split(','),
            video: themeInfoData.video.split(',')
          };
        } else {
          $common.showModal('未知错误');
        }
      },
      (res) => {
        $common.showModal('亲~网络不给力哦，请稍后重试');
      },
      (res) => {

      }
    )
  },
  onLoad: function(options) {
    if (options.ActivityID) { //修改
      this.data.ActivityID = +options.ActivityID;
      this.setData({
        pageStatus: true
      })
      this.getActivityData();
    }
  },
  onReady: function() {},
  isEnEvent() {
    let title = this.data.pageStatus ? '修改打卡活动' : '新建打卡活动';
    wx.setNavigationBarTitle({
      title
    });
  },
  onShow: function() {
    this.isEnEvent();
  },
  onHide: function() {
    this.stopPlay();
  },
  onUnload: function() {
    this.stopPlay();
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
  },
  onReachBottom: function() {},
  onShareAppMessage: function() {
    return $common.share()
  }
})