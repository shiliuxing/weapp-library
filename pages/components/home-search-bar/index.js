/**
 * 主页的搜索输入框
 */

Component({
  properties: {

  },

  data: {
    options: {
      selected: "书名",
      list: [
        "书名", "作者", "ISBN", "高级搜索", '标签' 
      ],
      show: false
    },
    isFocus: false,
    value: ""
  },

  methods: {
    onFocus: function() {
      this.setData({
        "options.selected": this.data.options.list[0],
        "isFocus": true
      })
      this.triggerEvent("focus")
    },

    onClear: function() {
      this.setData({
        "value": ""
      })
    },

    onCancel: function() {
      this.setData({
        "value": "",
        "isFocus": false,
        "options.show": false
      })
      this.triggerEvent("cancel")
    },

    onInput: function(e) {
      this.setData({
        "value": e.detail.value
      })
    },

    onTapOptionBtn: function() {
      this.setData({
        "options.show": !this.data.options.show // 切换列表显示
      })
    },

    onSelectOption: function(e) {
      if (e.currentTarget.dataset.option == "高级搜索") {
        wx.navigateTo({ url: "./children/advance_search" })
        return
      }
      this.setData({
        "options.selected": e.currentTarget.dataset.option,
        "options.show": false
      })
    },

    onScan: function() {
      var scanfn = getApp().promisify(wx.scanCode)
      scanfn().then((res) => {
            if (res.scanType != "CODE_128")
                return wx.showModal({ title: "扫描内容不合法", content: "请扫描图书ISBN条形码", showCancel: false })
            wx.navigateTo({
                url: "../book_detail/book_detail?isbn=" + res.result
            })
        })
    },

    onSearch: function(e) {
      this.triggerEvent("search", { 
        type: this.data.options.selected, 
        value: this.data.value 
      })
    }
  }
})