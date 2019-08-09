const $common = require('../../../utils/common.js');
Page({
  data: {
    year: 0,
    month: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0,
    time:[],
    listData:[],
    ContinuityDays:'',//连续签到天数
    SignInState:1,//今天的签到状态
  },
  GetUserSignIn(){
    // 参数【OpenId】【Year】年【Month】月      返回参数【UserSignInList：这个月已签到的列表】【ContinuityDays】连续签到天数    【SignInState】今天的签到状态  0：未签到   1：已签到
    $common.loading();
    $common.request(
      'POST',
      $common.config.GetUserSignIn, {
        OpenId: wx.getStorageSync('openid'),
        Year: this.data.year,
        Month: this.data.month
      },
      (res) => {
        if (res.data.res) {
          this.setData({
            time: res.data.UserSignInList,
            ContinuityDays: res.data.ContinuityDays,
            SignInState: res.data.SignInState
          })
          this.time()
        } else {
          $common.showModal('亲~网络不给力哦，请稍后重试');
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
  UserSignIn(){//签到
    $common.loading();
    $common.request(
      'POST',
      $common.config.UserSignIn, {
        OpenId: wx.getStorageSync('openid'),
      },
      (res) => {
        if (res.data.res) {
          $common.showToast('签到成功')
          this.GetUserSignIn()
        } else {
          $common.showToast('签到失败，请稍后重试')
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
  timeStamp(str) {//时间戳转换
    let timeStamp = str.replace(/\D/g, '');
    let date = new Date(+timeStamp),
      y = date.getFullYear(),
      m = date.getMonth() + 1,
      d = date.getDate();
    let obj = {
      y: y,
      m: m,
      d: d,
    }
    return obj;
  },
  time(){//签到日期
    let that=this
    let arr = that.data.time
    let dateArr = that.data.dateArr
    arr.forEach(function (value, index, arrSelf) {
      let data = that.timeStamp(value.UserSignInTime)
      let time = '' + data.y + data.m + data.d
      for (let i = 0; i < dateArr.length;i++){
        if (time == dateArr[i].isToday){
          dateArr[i].show=true
        }
      }
    });
    this.setData({dateArr})
  },
  onLoad: function () {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    this.dateInit();
    this.setData({
      year: year,
      month: month,
      isToday: '' + year + month + now.getDate()
    })
    this.GetUserSignIn()
    this.time()
  },
  dateInit: function (setYear, setMonth) {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let dateArr = [];                        //需要遍历的日历数组数据
    let arrLen = 0;                            //dateArr的数组长度
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth();                    //没有+1方便后面计算当月总天数
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    let startWeek = new Date(year + '/' + (month + 1) + '/' + 1).getDay();                            //目标月1号对应的星期
    let dayNums = new Date(year, nextMonth, 0).getDate();                //获取目标月有多少天
    let obj = {};
    let num = 0;

    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    arrLen = startWeek + dayNums;
    // month = (month + 1) < 10 ? '0' + (month + 1) : (month + 1)
    // num = num < 10 ? '0' + num : num
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        obj = {
          isToday: '' + year + (month + 1) + num,
          dateNum: num,
          weight: 5
        }
      } else {
        obj = {};
      }
      dateArr[i] = obj;
    }
    this.setData({
      dateArr: dateArr
    })
    let nowDate = new Date();
    let nowYear = nowDate.getFullYear();
    let nowMonth = nowDate.getMonth() + 1;
    let nowWeek = nowDate.getDay();
    let getYear = setYear || nowYear;
    let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;

    if (nowYear == getYear && nowMonth == getMonth) {
      this.setData({
        isTodayWeek: true,
        todayIndex: nowWeek
      })
    } else {
      this.setData({
        isTodayWeek: false,
        todayIndex: -1
      })
    }
  },
  lastMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
    this.GetUserSignIn();
    this.time();
  },
  nextMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
    this.GetUserSignIn();
    this.time();
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
    this.GetUserSignIn()
  },
})