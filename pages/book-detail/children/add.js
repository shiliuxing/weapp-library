import { getBooklistsByPhone, updateBooklistById } from '../../../apis/booklist'
import { showTip } from '../../../utils/tip'

var app = getApp()

Page({
  data: {
    // 图书 id
    id: undefined,
    // 图书描述
    description: '',
    // 用户创建的书单列表
    booklists: [],
    // 书单标题列表，用于选择器
    booklistTitles: [],
    // 选择的书单下标
    selectedIndex: 0
  },

  onLoad: function (options) {
    this.data.id = options.id
    showTip('ADD_TO_BOOKLIST')
  },

  // 从创建书单页返回时刷新书单列表
  onShow: function () {
    wx.showLoading({ title: '加载中', mask: true })
    getBooklistsByPhone(app.globalData.phone, 'create').then(res => {
      if (res.data.create && res.data.create.length) {
        let tmp = res.data.create
        this.setData({
          booklists: tmp,
          booklistTitles: tmp.map(e => e.title)
        })
      } else {
        wx.showModal({
          title: '创建书单',
          content: '您还没有创建书单，是否现在创建一个书单？',
          success: res => {
            if (res.confirm) {
              wx.navigateTo({ url: '/pages/booklist/children/modify?action=create' })
            } else {
              wx.navigateBack()
            }
          }
        })
      }
    }).finally(() => wx.hideLoading())
  },

  onSelect: function (e) {
    this.setData({ selectedIndex: e.detail.value })
  },

  onInput: function (e) {
    this.setData({ description: e.detail.value })
  },

  onSubmit: function () {
    wx.showLoading({ title: '加载中', mask: true })

    let { id, booklists, selectedIndex, description } = this.data

    updateBooklistById(booklists[selectedIndex].id, { add_items: {
      id, description
    }}).then(_ => {
      wx.showToast({ title: '操作成功', mask: true })
      setTimeout(() => wx.navigateBack(), 1000) // 直接后退时当前页面的 toast 会消失
    })
  }
})