const myHttps = "hgcard.1-zhao.fun";
const host = `https://${myHttps}`;
const phoneReg = /^(1[3456789]|9[28])\d{9}$/; // 正则手机号码
const srcImg = `${host}/QualifImgs/`; //图片
const ExaminationImg = `${host}/SmallCardMultiMedia/ExaminationImg/`; //考试图片
const CommodityImg = `${host}/SmallCardMultiMedia/CommodityImg/`; //积分商城图片
const srcUploadImg = `${host}/ImgCatch/`; //上传图片 
const srcVideo = `${host}/QuaLifAudios/`; //视频
const srcActivity = `${host}/AtyImages/`; //活动
const srcActivityVideo = `${host}/ActVideos/`; //活动视频
const srcBanner = `${host}/BannerImgs/`; //轮播图
const srcPoster = `${host}/Content/Images/`; //海报
const srcForIdPhoto = `${host}/ForIdPhoto/`; //证件照
const srcShar = `${host}/Content/SharePic/`; //分享图片
const srcClockInImage = `${host}/SmallCardMultiMedia/Images/`; //打卡图片
const srcClockInVideo = `${host}/SmallCardMultiMedia/Video/`; //打卡视频
const srcClockInAudio = `${host}/SmallCardMultiMedia/Voice/`; //打卡音频
const srcClockInCatch = `${host}/ImgCatch/`; //上传文件未确定的
const srcClockInFile = `${host}/SmallCardMultiMedia/File/`; //上传文件未确定的
const config = {
  //获取用户Openid
  GetSaveUserOpenId: `${host}/LittleProgram/UserInfo/GetSaveUserOpenId`,
  //更新用户头像与昵称 （2018-05-02）
  UpdateAvaUrlNick: `${host}/LittleProgram/UserInfo/UpdateAvaUrlNick`,
  // 获取登录页背景图
  GetLittleProImg: `${host}/LittleProgram/SmallCardActivity/GetLittleProImg`,
  //是否授权过
  GetMyAvaName: `${host}/LittleProgram/UserInfo/GetMyAvaName`,
  /*
    打卡
   */
  //打卡主界面
  GetSmallCardActivity: `${host}/LittleProgram/SmallCardActivity/GetSmallCardActivity`,
  //首页banner
  GetRotationChartImgs: `${host}/LittleProgram/SystemSetup/GetRotationChartImgs`,
  //获取打卡活动 全部主题页面
  GetThemeList: `${host}/LittleProgram/SmallCardActivity/GetThemeList`,
  //获取活动详情信息
  GetSmallCardActivityInfo: `${host}/LittleProgram/SmallCardActivity/GetSmallCardActivityInfo`,
  //获取打卡活动 用户积分排名
  GetSmallCardUserRanking: `${host}/LittleProgram/SmallCardActivity/GetSmallCardUserRanking`,
  // 获取活动积分规则信息
  GetActivityRule: `${host}/LittleProgram/SmallCardActivity/GetActivityRule`,
  //  修改活动积分规则信息
  PutActivityRule: `${host}/LittleProgram/SmallCardActivity/PutActivityRule`,
  // 上传图片
  UpLoadImg: `${host}/LittleProgram/InsertSmallCard/UpLoadImg`,
  // 上传活动音频
  UploadVoice: `${host}/LittleProgram/InsertSmallCard/UploadVoice`,
  // 上传活动视频
  UploadVideo: `${host}/LittleProgram/InsertSmallCard/UploadVideo`,
  //上传文件
  UpLoadFile: `${host}/LittleProgram/InsertSmallCard/UpLoadFile`,
  // 删除文件
  DelAtyFile: `${host}/LittleProgram/InsertSmallCard/DelAtyFile`,
  // 新建打卡活动
  InsertActivities: `${host}/LittleProgram/InsertSmallCard/InsertActivities`,
  // 打卡详情
  GetCurrentTheme: `${host}/LittleProgram/SmallCardJournal/GetCurrentTheme`,
  // 打卡详情ta
  GetTeaCurrentTheme: `${host}/LittleProgram/SmallCardJournal/GetTeaCurrentTheme`,
  // 添加打卡主题数据
  InsertTheme: `${host}/LittleProgram/InsertSmallCard/InsertTheme`,
  // 获取昨日概况统计数据
  GetYesterDayStatistics: `${host}/LittleProgram/SmallCardActivity/GetYesterDayStatistics`,
  // 获取全部统计数据  可按日期查询
  GetSmallCardStatistics: `${host}/LittleProgram/SmallCardActivity/GetSmallCardStatistics`,
  // 打卡活动成员管理
  GetSmallCardActivityUserList: `${host}/LittleProgram/SmallCardActivity/GetSmallCardActivityUserList`,
  // 发表日记
  InsertJournal: `${host}/LittleProgram/InsertSmallCard/InsertJournal`,
  // 详情页的日记列表
  GetSmallCardActivityDiary: `${host}/LittleProgram/SmallCardJournal/GetSmallCardActivity`,
  // 主题详情页，  获取某个主题的详情
  GetSmallCardThemeInfo: `${host}/LittleProgram/SmallCardTheme/GetSmallCardThemeInfo`,
  // 我的 ，  获取我的打卡日记列表
  GetUserSmallCardJournal: `${host}/LittleProgram/SmallCardJournal/GetUserSmallCardJournal`,
  // 主题详情， 打卡日记
  GetSmallCardThemeJournal: `${host}/LittleProgram/SmallCardTheme/GetSmallCardThemeJournal`,
  // 成员管理 ， 控制权限状态
  UpdateUserLimit: `${host}/LittleProgram/SmallCardActivity/UpdateUserLimit`,
  //点赞
  InsertFabulous: `${host}/LittleProgram/InsertSmallCard/InsertFabulous`,
  //取消点赞
  DeleteFabulous: `${host}/LittleProgram/InsertSmallCard/DeleteFabulous`,
  //评论别人
  InsertComment: `${host}/LittleProgram/InsertSmallCard/InsertComment`,
  //获取某人的打卡日记
  GetSmallCardJournalInfo: `${host}/LittleProgram/SmallCardTheme/GetSmallCardJournalInfo`,
  //打卡详情页，添加浏览记录
  InsertActivityParticipate: `${host}/LittleProgram/InsertSmallCard/InsertActivityParticipate`,
  //插入分享记录
  InsertShare: `${host}/LittleProgram/InsertSmallCard/InsertShare`,
  //修改活动， 获取活动信息
  GetActivitiesInfo: `${host}/LittleProgram/InsertSmallCard/GetActivitiesInfo`,
  //修改活动， 修改
  UpdateActivities: `${host}/LittleProgram/InsertSmallCard/UpdateActivities`,
  //海报
  GetPosterImageInfo: `${host}/LittleProgram/SmallCardActivity/GetPosterImageInfo`,
  //删除主题
  GetDateTheme: `${host}/LittleProgram/InsertSmallCard/GetDateTheme`,
  //修改主题，获取主题信息
  GetThemeInfo: `${host}/LittleProgram/InsertSmallCard/GetThemeInfo`,
  //修改主题，修改
  UpdateTheme: `${host}/LittleProgram/InsertSmallCard/UpdateTheme`,
  //删除打卡日记
  GetDeleteJournal: `${host}/LittleProgram/SmallCardJournal/GetDeleteJournal`,
  //删除活动
  GetDeleteActivity: `${host}/LittleProgram/SmallCardActivity/GetDeleteActivity`,
  // 打卡，  获取某个主题的详情
  GetThemeInfoClockIn: `${host}/LittleProgram/SmallCardTheme/GetThemeInfo`,
  //更改用户审核状态
  UpdateUserApplyState: `${host}/LittleProgram/SmallCardActivity/UpdateUserApplyState`,
  // 获取打卡活动介绍
  GetSmallCardApplyOrPaymentInf: `${host}/LittleProgram/SmallCardActivity/GetSmallCardApplyOrPaymentInfo`,
  //提交申请
  PostUserApplyInfo: `${host}/LittleProgram/SmallCardActivity/PostUserApplyInfo`,
  //购买打卡活动
  PostUserPaymentInfo: `${host}/LittleProgram/SmallCardActivity/PostUserPaymentInfo`,
  //打卡活动取消付款，删除支付信息 
  CanCelPay: `${host}/LittleProgram/SmallCardActivity/CanCelPay`,
  //获取某用户进入打卡活动的权限      
  GetUserCardJurisdiction: `${host}/LittleProgram/SmallCardActivity/GetUserCardJurisdiction`,
  //用户签到
  UserSignIn: `${host}/LittleProgram/UserSignIn/UserSignIn`,
  //获取签到列表
  GetUserSignIn: `${host}/LittleProgram/UserSignIn/GetUserSignIn`,
  //获取用户未考的试卷列表  
  GetTestPaperList: `${host}/LittleProgram/TestPaperInfos/GetTestPaperList`,
  //用户参加考试
  UserParticipateInTest: `${host}/LittleProgram/TestPaperInfos/UserParticipateInTest`,
  // 用户答题  
  PutSubjectsAnswer: `${host}/LittleProgram/TestPaperInfos/PutSubjectsAnswer`,
  // 用户提交答卷
  PostUserAnswerSheet: `${host}/LittleProgram/TestPaperInfos/PostUserAnswerSheet`,
  // 获取用户积分信息
  GetUserIntegral: `${host}/LittleProgram/UserInfo/GetUserIntegral`,
  // 获取用户答卷列表 
  GetUserAnswerList: `${host}/LittleProgram/TestPaperInfos/GetUserAnswerList`,
  // 获取答卷题目详情
  GetUserAnswerChilds: `${host}/LittleProgram/TestPaperInfos/GetUserAnswerChilds`,
  // 获取某用户的基金列表
  GetUserLearnList: `${host}/LittleProgram/LearningFund/GetUserLearnList`,
  // 学习基金提现
  UserLearnCashWithdrawal: `${host}/LittleProgram/LearningFund/UserLearnCashWithdrawal`,
  //积分商品列表
  GetCommodityList: `${host}/LittleProgram/InetgralCommodity/GetCommodityList`,
  // 获取商品详情
  GetCommodityDetails: `${host}/LittleProgram/InetgralCommodity/GetCommodityDetails`,
  //  获取确认订单的信息
  GetConfirmOrderInfo: `${host}/LittleProgram/InetgralCommodity/GetConfirmOrderInfo`,
  //  提交积分订单
  PushIntegralOrder: `${host}/LittleProgram/InetgralCommodity/PushIntegralOrder`,
  // 获取订单列表
  GetIntegralOrderList: `${host}/LittleProgram/InetgralCommodity/GetIntegralOrderList`,
  // 获取订单详情
  GetIntegralOrderDetails: `${host}/LittleProgram/InetgralCommodity/GetIntegralOrderDetails`,
  // 获取物流信息 
  GetOrderLogistics: `${host}/LittleProgram/InetgralCommodity/GetOrderLogistics`,
  // 确认收货 
  PostReceivingGoods: `${host}/LittleProgram/InetgralCommodity/PostReceivingGoods`,
  // 获取积分商城Banner图
  GetIntegralBanners: `${host}/LittleProgram/InetgralCommodity/GetIntegralBanners`,
  // 是否跳到绑定页面
  GetIsBinding: `${host}/LittleProgram/UserInfo/GetIsBinding`,
  // 绑定接口
  UserBinding: `${host}/LittleProgram/UserInfo/UserBinding`,
}


module.exports = {
  config: config,
  phoneReg: phoneReg,
  srcImg: srcImg,
  ExaminationImg: ExaminationImg,
  CommodityImg:CommodityImg,
  srcUploadImg: srcUploadImg,
  srcVideo: srcVideo,
  srcActivity: srcActivity,
  srcBanner: srcBanner,
  srcPoster: srcPoster,
  srcForIdPhoto: srcForIdPhoto,
  srcActivityVideo: srcActivityVideo,
  srcShar: srcShar,
  srcClockInImage,
  srcClockInVideo,
  srcClockInAudio,
  srcClockInCatch,
  srcClockInFile,
  //请求数据
  request(method, url, data, success = () => { }, fail = () => { }, complete = () => { }) {
    wx.request({ url, data, method, header: { 'content-type': 'application/json' }, success, fail, complete })
  },
  //模态弹窗
  showModal(content, showCancel = true, success = () => { }, confirmText = '确定', title = '提示', cancelText = '取消') {
    wx.showModal({ title, content, showCancel, confirmText, cancelText, success });
  },
  //拍摄视频或从手机相册中选视频
  chooseVideo(success = () => { }) {
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      compressed: true,
      maxDuration: 60,
      success,
      complete: function (res) { }
    })
  },
  //从本地相册选择图片或使用相机拍照
  chooseImage(success = () => { }, count = 9) {
    wx.chooseImage({
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      count,
      success,
    })
  },
  //获取openid
  getOpenid(callback = () => { }) {
    let openid = wx.getStorageSync('openid');
    if (openid) return callback()
    wx.login({
      complete: (res) => {
        if (res.code) {
          wx.request({
            url: config.GetSaveUserOpenId,
            data: { code: res.code },
            header: { 'content-type': 'application/json' },
            method: 'POST',
            success: (res) => {
              if (res.data.res) {
                wx.setStorageSync('openid', res.data.openid);
                callback();
              }
            }
          });
        }
      }
    })
  },
  //获取并更新用户头像等信息
  getUserInfo(userInfo, callback = () => { }) {
    wx.setStorageSync('userInfo', userInfo);
    wx.request({
      url: config.UpdateAvaUrlNick,
      data: {
        openId: wx.getStorageSync('openid'),
        avaUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName,
        gender: userInfo.gender == 1 ? 1 : 0 //1男0女
      },
      header: { 'content-type': 'application/json' },
      method: 'POST',
      success: (res) => {
        if (res.data.res) {
          wx.setStorageSync('prevGetInfo', new Date().getTime()) //记录本次获取头像等信息的时间戳
          callback()
        }
      }
    });
  },
  //数组去重保留旧数据
  unique(arr, id) {
    let hash = {};
    return arr.reduce(function (item, target) {
      hash[target[id]] ? '' : hash[target[id]] = true && item.push(target);
      return item;
    }, []);
  },
  loading(type = 1) {
    let title = '';
    switch (+type) {
      case 1:
        title = '请求中...';
        break;
      case 2:
        title = '上传中...';
        break;
      case 3:
        title = '删除中...';
        break;
      default:
        title = '请求中...';
    }
    wx.showLoading({
      title,
      mask: true
    })
  },
  hide() {
    wx.hideLoading()
  },
  showToast(title = '提示内容', icon = 'none', duration = 1500, mask = false) {
    return new Promise((resolve, reject) => wx.showToast({
      title,
      icon,
      mask,
      duration
    }))
  },
  //时间戳转换为时间
  timeStamp(str) {
    let timeStamp = str.replace(/\D/g, '');
    let date = new Date(+timeStamp),
      y = date.getFullYear(),
      m = date.getMonth() + 1,
      d = date.getDate(),
      h = date.getHours(),
      mi = date.getMinutes(),
      s = date.getSeconds(),
      w = date.getDay();
    m < 10 && (m = '0' + m);
    d < 10 && (d = '0' + d);
    h < 10 && (h = '0' + h);
    mi < 10 && (mi = '0' + mi);
    s < 10 && (s = '0' + s);
    let obj = {
      y: y,
      m: m,
      d: d,
      h: h,
      mi: mi,
      s: s,
      w: w,
      time: `${y}-${m}-${d} ${h}:${mi}`
    }
    return obj;
  },
  //取倒计时（天时分秒）
 getTimeLeft(datetimeTo) {
  // 计算目标与现在时间差（毫秒）
  let time1 = new Date(datetimeTo).getTime();
  let time2 = new Date().getTime();
  let mss = time1 - time2;
  // 将时间差（毫秒）格式为：天时分秒
  let days = parseInt(mss / (1000 * 60 * 60 * 24));
  let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  // let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
   let minutes = parseInt((mss / (60 * 1000)));
  let seconds = parseInt((mss % (1000 * 60)) / 1000);

  // return  hours + ":" + minutes + ":" + seconds
   let obj = { hours, minutes, seconds, time:  minutes + ":" + seconds }
   return obj
},
  share(path = '/pages/login/login', success = () => { }, title = '海格通信打卡', imageUrl = null) { //分享
   success()
    return { title, path, imageUrl, success }
  },
  trim(data) { //判断字符串是否为空
    return (str) => data[str].trim().length > 0
  },

}