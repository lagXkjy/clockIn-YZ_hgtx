/***
 *      ┌─┐       ┌─┐
 *   ┌──┘ ┴───────┘ ┴──┐
 *   │                 │
 *   │       ───       │
 *   │  ─┬┘       └┬─  │
 *   │                 │
 *   │       ─┴─       │
 *   │                 │
 *   └───┐         ┌───┘
 *       │         │
 *       │         │
 *       │         │
 *       │         └──────────────┐
 *       │                        │
 *       │                        ├─┐
 *       │                        ┌─┘
 *       │                        │
 *       └─┐  ┐  ┌───────┬──┐  ┌──┘
 *         │ ─┤ ─┤       │ ─┤ ─┤
 *         └──┴──┘       └──┴──┘
 *                神兽保佑
 *               代码无BUG!
 */
App({
  onLaunch(e) {
    this.scene = e.scene; //设置场景值
  },
  onShow() {
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调,里面好像没啥用
    });
    updateManager.onUpdateReady((res) => {
      updateManager.applyUpdate();
    });
  },
  $common: require('./utils/common.js'),
  themeImage: { //选择的主题头图
    path: '',
    size: '', //选择的图片的大小
    cutImage: '', //剪裁的图片路径
  },
  scene: 1001, //打开小程序时的场景值
  CommentList: null, //打卡，日记评论数据
  clockInStatus: false, //是否打卡成功
})