// pages/clockIn/questions/questions.js
const $common = require('../../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inExaminationTips: true, //考试提示按钮显示
    inmask: true, //考试提示的显示隐藏
    timeLeft: '0:0', //时间
    maxtime: 10,
    start: false, //是否开始考试
    subscript: 0, //题目下标
    TpExplain: '', //考试提示
    TpId: '', //试卷id
    timer: '', //时间计时器
    info: {
      inmask: true, //考试提示的显示隐藏
    },
  },
  previous() { //上一题
    this.data.subscript--
      this.setData({
        subscript: this.data.subscript
      })
  },
  Next() { //下一题
    let checkbox = this.data.info.Subjects[this.data.subscript].UascOptions
    let item = checkbox.find(item => {
      return item.checked;
    });
    if (item != undefined ) {
      let Answer = []; //答案数组
      let arr = ''
      checkbox.forEach(values => {
        if (values.checked) {
          arr += values.option
        }
      })
      Answer.push(arr)
      // 用户答题       参数【UascId】答卷详ID       【Answer】用户答案，数组格式
      // if (this.data.info.Subjects[this.data.subscript].UascUserAnswer == '') {
        $common.loading()
        $common.request(
          'POST',
          $common.config.PutSubjectsAnswer, {
            UascId: this.data.info.Subjects[this.data.subscript].UascId,
            Answer: Answer
          },
          (res) => {
            if (res.data.res) {
              this.data.subscript++
              this.setData({
                subscript: this.data.subscript
              })
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
    } else {
      $common.showToast('您还没有选择哦')
    }
  },
  Submission() { //提交
    $common.loading('提交中')
    let checkbox = this.data.info.Subjects[this.data.subscript].UascOptions
    let item = checkbox.find(item => {
      return item.checked;
    });
    if (item != undefined) {
      let Answer = []; //答案数组
      checkbox.forEach(values => {
        if (values.checked) {
          Answer.push(values.option)
        }
      })
      // 用户答题       参数【UascId】答卷详ID       【Answer】用户答案，数组格式
      $common.request(
        'POST',
        $common.config.PutSubjectsAnswer, {
          UascId: this.data.info.Subjects[this.data.subscript].UascId,
          Answer: Answer
        },
        (res) => {
          if (res.data.res) {
            this.Submit()
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
    } else {
      $common.showToast('您还没有选择哦')
    }
  },
  timeStamp(str) {
    let timeStamp = str;
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
      w: w
    }
    return obj;
  },
  time() { //时间计时器
    let that = this
    let data = Date.parse(new Date()) + (that.data.info.TestInfo.TpDuration * 60 * 1000)
    let time = that.timeStamp(data)
    let times = `${time.y}/${time.m}/${time.d} ${time.h}:${time.mi}:${time.s}`
    that.data.timer = setInterval(() => { //注意箭头函数！！
      let getTimeLeft = $common.getTimeLeft(times)
      that.setData({
        timeLeft: $common.getTimeLeft(times).time //使用了util.getTimeLeft
      });
      if (getTimeLeft.hours == 0 && getTimeLeft.minutes == 0 && getTimeLeft.seconds == 0) {
        clearInterval(that.data.timer)
        that.Submit()
      }
    }, 1000);
  },
  Submit() {
    $common.request(
      'POST',
      $common.config.PostUserAnswerSheet, {
        OpenId: wx.getStorageSync('openid'),
        UasId: this.data.info.TestInfo.UasId,
      },
      (res) => {
        if (res.data.res) {
          clearInterval(this.data.timer)
          wx.reLaunch({
            url: `../Completion/Completion?TotalScore=${res.data.TotalScore}&Duration=${res.data.Duration}`,
          })
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
  checkbox: function(e) { //选
    var index = e.currentTarget.dataset.index; //获取当前点击的下标
    let Subjects = this.data.info.Subjects
    var checkboxArr = Subjects[this.data.subscript].UascOptions; //选项集合
    let info = this.data.info
    if (Subjects[this.data.subscript].UascType == 2) {
      checkboxArr[index].checked = !checkboxArr[index].checked; //改变当前选中的checked值
    } else {
      if (checkboxArr[index].checked) return; //如果点击的当前已选中则返回
      checkboxArr.forEach(item => {
        item.checked = false
      })
      checkboxArr[index].checked = true; //改变当前选中的checked值
      // Subjects[this.data.subscript].UascOptions = checkboxArr
      info.Subjects[this.data.subscript].UascOptions = checkboxArr
    }
    this.setData({
      info
    });
  },
  checkboxChange: function(e) { //选中的数组
    var checkValue = e.detail.value;
    this.setData({
      checkValue: checkValue
    });
  },
  Tips() { //显示考试提示
    this.data.inmask = true
    this.setData({
      inmask: this.data.inmask,
      inExaminationTips: false
    })
  },
  showTab(e) { //获取组件返回数据
    let that = this
    that.data.subscript = 0
    if (e != undefined) {
      that.setData({
        info: e.detail,
        start: e.detail.start,
        inmask: e.detail.inmask,
      })
      if (e.detail.start) {
        that.time()
        that.data.info.Subjects.forEach(value => {
          if (value.UascUserAnswer != '') {
            that.data.subscript++
          }
        })
        that.setData({
          subscript: that.data.subscript
        })
      }
    }
  },
  inmask(e){
    let that=this
    if (e != undefined) {
      that.setData({
        inmask: e.detail,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: options.title
    })
    this.setData({
      TpExplain: options.TpExplain,
      TpId: +options.TpId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.showTab()
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
    clearInterval(this.data.timer)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})