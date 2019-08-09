// component/ExaminationTips/ExaminationTips.js
const $common = require('../../utils/common.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tips: {
      type: String,
      value: {
        // tips:'tishi',
        isHot: false
      },
      observer(e) {}
    },
    info: {
      type: Object,
      value: {
        // tips:'tishi',
        // isHot: false
      },
      observer(e) {}
    },
    TpId: {
      type: Number
    },
    show: {
      type: Boolean,
    },
    start: {
      type: Boolean,
    }
  },
  ready: function() {
  },
  /**
   * 组件的初始数据
   */
  data: {
    info: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    start() {
      if (this.data.show) {
        $common.loading();
        $common.request(
          'POST',
          $common.config.UserParticipateInTest, {
            openId: wx.getStorageSync('openid'),
            TpId: this.data.TpId,
          },
          (res) => {
            if (res.data.res) {
              let Subjects = res.data.Subjects
              Subjects.forEach(item => {
                item.UascOptions = JSON.parse(item.UascOptions)
                let UascUserAnswer=item.UascUserAnswer.split(',')
                item.UascOptions.forEach((value) => {
                  UascUserAnswer.forEach(res=> {
                    if (res == value.option) {
                      value.checked = true
                    }
                  })

                })
              })
              
              this.data.info.inmask = false
              this.data.info.start = true
              this.data.info.Subjects = Subjects,
                this.data.info.TestInfo = res.data.TestInfo,
                this.setData({
                  info: this.data.info
                })
              this.triggerEvent('showTab', this.data.info);
            } else {
              $common.showModal('开始失败');
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
        this.data.inmask = false
        this.triggerEvent('inmask', this.data.inmask);
      }
      // this.triggerEvent('showTab', this.data.info);
    }
  }
})