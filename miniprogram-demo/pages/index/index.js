const app = getApp();
const api = require("../../api/goods");

const PAGE_SIZE = 3;

Page({
  data: {
    banner: {},
    tabs: ["好果报恩", "超值必买", "好吃推荐"],
    activeTab: 0,
    products: [],
    page: 1,
    hasMore: true,
    loadingMore: false,
    cartCount: 0,
    cartTotal: "0.00"
  },

  onLoad() {
    this.loadBanner();
    this.loadProducts(0, 1);
  },

  onShow() {
    this.refreshCart();
  },

  async loadBanner() {
    const banner = await api.getBanner();
    this.setData({ banner });
  },

  // 加载某分类某页；append=true 表示追加（分页加载更多）
  async loadProducts(tabIndex, page, append = false) {
    const { list, hasMore } = await api.getGoodsList(tabIndex, page, PAGE_SIZE);
    this.setData({
      products: append ? this.data.products.concat(list) : list,
      page,
      hasMore,
      loadingMore: false
    });
  },

  // 切换分类 Tab → 重置到第 1 页
  onTabChange(e) {
    const index = Number(e.currentTarget.dataset.index);
    this.setData({ activeTab: index, products: [], hasMore: true });
    this.loadProducts(index, 1);
  },

  // 下拉刷新
  async onPullDownRefresh() {
    await Promise.all([this.loadBanner(), this.loadProducts(this.data.activeTab, 1)]);
    wx.stopPullDownRefresh();
  },

  // 上拉触底 → 加载下一页
  onReachBottom() {
    if (!this.data.hasMore || this.data.loadingMore) return;
    this.setData({ loadingMore: true });
    this.loadProducts(this.data.activeTab, this.data.page + 1, true);
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` });
  },

  goSearch() {
    wx.navigateTo({ url: "/pages/search/search" });
  },

  refreshCart() {
    const cart = app.globalData.cart;
    this.setData({
      cartCount: cart.reduce((n, i) => n + i.count, 0),
      cartTotal: app.getCartTotal().toFixed(2)
    });
  },

  goCart() {
    wx.switchTab({ url: "/pages/cart/cart" });
  }
});
