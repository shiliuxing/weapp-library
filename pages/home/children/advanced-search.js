// 高级搜索参数
var params = ['title', 'author', 'translator', 'publisher', 'pubdate_start', 'pubdate_end'] // 还有language

Page({
  data: {
    title: '',
    author: '',
    translator: '',
    publisher: '',
    pubdate_start: '',
    pubdate_end: '',
    selectedLanguageIndex: 0,
    languages: ['汉语', '英语']
  },

  onInput: function (e) {
    var params = {}
    params[e.currentTarget.dataset.label] = e.detail.value
    this.setData(params)
  },

  onDateChange: function (e) {
    switch (e.currentTarget.dataset.type) {
      case 'start':
        this.setData({pubdate_start: e.detail.value})
        break
      case 'end':
        this.setData({pubdate_end: e.detail.value})
        break
    }
  },

  onLanguageChange: function (e) {
    this.setData({selectedLanguageIndex: e.detail.value})
  },

  onReset: function () {
    this.setData({
      title: '',
      author: '',
      translator: '',
      publisher: '',
      pubdate_start: '',
      pubdate_end: '',
      selectedLanguageIndex: 0
    })
  },

  onSearch: function () {
    let { languages, selectedLanguageIndex } = this.data

    var url = '/pages/list/book?type=advanced_search'

    // 默认至少有一个language参数
    url += `&language=${languages[selectedLanguageIndex]}`

    // 其余参数不能只包含空格
    params.forEach(e => {
      let str = this.data[e].trim()
      if (str) {
        url += `&${e}=${str}`
      }
    })

    wx.navigateTo({ url: url })
  }
})