import { getBooklistsByPhone, deleteBooklistById } from '../../apis/booklist'
import Promisify from '../../utils/promisify'

var app = getApp()

Page({
  data: {
    booklists: {
      create: [], // 我创建的书单
      favorite: [] // 我收藏的书单
    }
  },

  onLoad: function (options) {
    wx.showNavigationBarLoading()
    this._fetchData().then(() => {
      wx.hideNavigationBarLoading()
    }).catch(() => {
      wx.hideNavigationBarLoading()
    })
  },

  // 从书单详情页返回后更新数据，因为有可能在书单详情页操作过
  onShow: function () {
    this._fetchData()
  },

  onPullDownRefresh: function () {
    this._fetchData().then(() => {
      wx.stopPullDownRefresh()
    }).catch(() => {
      wx.stopPullDownRefresh()
    })
  },

  onSearch: function (e) {
    wx.navigateTo({
      url: '/pages/list/booklist?type=search&keyword=' + e.detail.value
    })
  },

  onCreate: function () {
    wx.navigateTo({
      url: './children/modify?action=create'
    })
  },

  onShowActionSheet: function (e) {
    let actions = {
      create: ['编辑书单', '删除书单'],
      favorite: ['取消收藏']
    }
    let type = e.currentTarget.dataset.type
    let index = e.currentTarget.dataset.index
    let id = this.data.booklists[type][index].id

    Promisify(wx.showActionSheet)({
      itemList: actions[type],
      itemColor: '#000'
    }).then(res => {
      // 如果点击了“编辑书单”，则跳转至书单信息编辑页
      if (res.tapIndex === 0 && type === 'create') {
        wx.navigateTo({
          url: './children/modify?action=modify&id=' + id
        })
      } else {
        let title
        let content
        if (type === 'create') {
          title = '删除书单'
          content = '确定删除此书单及其包含书目？这项操作将无法撤销'
        } else {
          title = '取消收藏'
          content = '确定取消收藏此书单？这项操作将无法撤销'
        }

        wx.showModal({
          title: title,
          content: content,
          success: res => {
            if (res.confirm) {
              // 删除书单/取消收藏使用同一个接口
              deleteBooklistById(id).then(() => {
                // 从 data 中删除该书单
                let tmp = this.data.booklists
                tmp[type].splice(index, 1)
                this.setData({
                  booklists: tmp
                })

                wx.showToast({
                  title: '操作成功'
                })
              })
            }
          }
        })
      }
    }).catch(e => {
      // cancel
    })
  },

  _fetchData: function () {
    return getBooklistsByPhone(app.globalData.phone).then(res => {
      this.setData({
        booklists: res.data
      })
    })
  }
})
