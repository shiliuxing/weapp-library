import Promise from './utils/es6-promise'
import promisePolyfill from './utils/promise-polyfill' // 添加 promise.finally
import { setTipSettings, initTipSettings } from './utils/tip' // 使用帮助
import EventEmitter from './utils/event' // 事件总线
import { getUserInfoById } from './apis/user' // 获取用户信息
import { UID_KEY } from './utils/permission'

App({
  event: new EventEmitter(),

  /**
   * 全局保存用户信息，只能通过getter和setter访问和修改
   */
  globalData: {
    // 用户id
    _uid: null,

    // 用户完整信息
    _userInfo: {
      id: null, // 用户id
      phone: '', // 手机号
      openid: '', // openid
      status: undefined, // 账号状态：0~3 未审核、已通过、未通过、已拉黑
      review_msg: '', //  管理员驳回资质审核材料时给图书馆的简短说明
      nickname: '', // 昵称
      avatar: '', // 头像链接
      name: '', // 真实姓名
      birthday: '', // 出生日期
      id_number: '', // 身份证号码
      id_card_img: { // 身份证图片链接
        front: '', // 身份证正面
        back: '' // 身份证反面
      },
      address: '', // 地址
      postcode: '', // 邮编
      deposit_status: undefined, // 押金状态：0~2 未支付、已支付、已退还
      reading_statistics: { // 阅读统计
        book_num: undefined, // 读了几本书
        page_num: undefined // 读了多少页
      }
    }
  },

  onLaunch: function () {
    // 自动登录
    var id = wx.getStorageSync(UID_KEY)
    this.setUID(id)

    // 初始化设置
    initTipSettings()
  },

  /**
   * 获取用户信息
   * @return {Promise}
   */
  getUserInfo: function () {
    let { _uid, _userInfo } = this.globalData
    if (!_uid) {
      return Promise.reject(new Error('未登录'))
    }
    // 已经有用户信息时直接返回
    if (_userInfo.id) {
      return Promise.resolve(_userInfo)
    }

    return getUserInfoById(_uid).then(res => {
      this.setUserInfo(res.data)
      return res.data
    })
  },

  /**
   * 设置用户信息
   * @event <userInfoChanged>
   */
  setUserInfo: function (userInfo) {
    this.globalData._userInfo = userInfo
    this.event.emit('userInfoChanged', {userInfo: userInfo})
  },

  /**
   * 获取用户id
   * @return integer|null
   */
  getUID: function () {
    return this.globalData._uid || null
  },

  /**
   * 设置用户id
   * @return integer|null
   */
  setUID: function (uid) {
    this.globalData._uid = uid
  }
})
