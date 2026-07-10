const api = require("../../api/goods");

Page({
  data: {
    keyword: "",
    results: [],
    searched: false,
    hotWords: ["奶皇杏", "车厘子", "榴莲", "西瓜", "脐橙"]
  },

  onInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  onHotTap(e) {
    const keyword = e.currentTarget.dataset.word;
    this.setData({ keyword }, () => this.doSearch());
  },

  async doSearch() {
    const kw = this.data.keyword.trim();
    if (!kw) {
      wx.showToast({ title: "请输入关键词", icon: "none" });
      return;
    }
    const results = await api.searchGoods(kw);
    this.setData({ results, searched: true });
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` });
  }
});
