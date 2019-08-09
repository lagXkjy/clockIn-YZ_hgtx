// pages/clockIn/payment/payment.js
const $common = require('../../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    srcImg: $common.srcClockInImage,
    ActivityPattern: 0, //收费或申请
    PaymentInfo: null,
    ActivityHeadImage: '',
    ActivityPrice: '',
    ActivityName: '',
    name: '', //姓名
    phone: '', //手机号
  },
  name(e) { //名字
    this.setData({
      name: e.detail.value
    })
  },
  phone(e) { //手机号
    this.setData({
      phone: e.detail.value
    })
  },
  payment() { //确认提交 付款
  let that=this
    let {
      phone,
      name
    } = that.data
    if (name == '') {
      $common.showModal('姓名不能为空')
    } else if ($common.phoneReg.test(phone) == false) {
      $common.showModal('请填写正确手机号')
    } else {
      wx.setStorageSync('name', name);
      wx.setStorageSync('phone', phone);
      $common.request(
        'POST',
        $common.config.PostUserPaymentInfo, {
          OpenId: wx.getStorageSync('openid'),
          ActivityID: that.data.ActivityID,
          Name: that.data.name, 
          Phone: that.data.phone
        },
        (res) => {
          if (res.data.res) {
            wx.requestPayment({
              'timeStamp': res.data.paras.timeStamp,
              'nonceStr': res.data.paras.nonceStr,
              'package': res.data.paras.package,
              'signType': 'MD5',
              'paySign': res.data.paras.paySign,
              'success': function(res) {
                console.log('success');
                wx.showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 3000
                });
                wx.navigateBack({
                  delta: 1
                })
              },
              'fail': function(fail) {
                console.log(res)
                console.log(res.data.userId)
                console.log('取消支付')
                $common.request(
                  'POST',
                  $common.config.CanCelPay, {
                    // 【userId】用户ID【scpId】支付表ID【atyId】活动ID
                    userId: res.data.userId,
                    scpId: res.data.scpId,
                    atyId: that.data.ActivityID
                  },
                  (res) => {
                    if (res.data.res) {

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
              'complete': function(res) {
                console.log('complete');
              }
            });
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
    }
  },
  Apply() { //提交申请
    let {
      phone,
      name
    } = this.data
    if (name == '') {
      $common.showModal('姓名不能为空')
    } else if ($common.phoneReg.test(phone) == false) {
      $common.showModal('请填写正确手机号')
    } else {
      wx.setStorageSync('name', name);
      wx.setStorageSync('phone', phone);
      $common.request(
        'POST',
        $common.config.PostUserApplyInfo, {
          OpenId: wx.getStorageSync('openid'),
          ActivityID: this.data.ActivityID,
          Name: this.data.name,
          Phone: this.data.phone
        },
        (res) => {
          if (res.data.res) {
            wx.navigateBack({
              delta: 1
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
    }
  },
  GetPaymentInfo() { //获取打卡活动介绍
    $common.loading();
    $common.request(
      'POST',
      $common.config.GetSmallCardApplyOrPaymentInf, {
        OpenId: wx.getStorageSync('openid'),
        ActivityID: this.data.ActivityID,
        IsJs: false
      },
      (res) => {
        if (res.data.res) {
          this.setData({
            ActivityHeadImage: res.data.Data.ActivityHeadImage,
            ActivityName: res.data.Data.ActivityName,
            ActivityPrice: res.data.Data.ActivityPrice,
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
  onLoad: function(options) {
    let name = wx.getStorageSync('name')
    let phone = wx.getStorageSync('phone')
    this.setData({
      ActivityPattern: +options.ActivityPattern,
      ActivityID: +options.ActivityID,
      name: name == '' ? '' : name,
      phone: phone == '' ? '' : phone,
    })
    if (this.data.ActivityPattern == 2) {
      wx.setNavigationBarTitle({
        title: '活动申请'
      })
    }
    this.GetPaymentInfo()
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