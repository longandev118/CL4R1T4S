const app = getApp();
const api = require("../../api/goods");

Page({
  data: {
    banner: {},
    tabs: ["好果报恩", "超值必买", "好吃推荐"],
    activeTab: 0,
    products: [],
    cartCount: 0,
    cartTotal: "0.00"
  },

  onLoad() {
    this.loadBanner();
    this.loadProducts(0);
  },

  onShow() {
    this.refreshCart();
  },

  async loadBanner() {
    const banner = await api.getBanner();
    this.setData({ banner });
  },

  async loadProducts(tabIndex) {
    const products = await api.getGoodsList(tabIndex);
    this.setData({ products });
  },

  // 切换分类 Tab
  onTabChange(e) {
    const index = Number(e.currentTarget.dataset.index);
    this.setData({ activeTab: index });
    this.loadProducts(index);
  },

  // 点击卡片 → 商品详情页
  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` });
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
