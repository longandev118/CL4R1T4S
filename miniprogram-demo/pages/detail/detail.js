const app = getApp();
const api = require("../../api/goods");

Page({
  data: {
    detail: null,
    bannerIndex: 0,
    // 规格选择弹层
    showSpec: false,
    specAction: "cart", // cart=加入购物车 buy=立即购买
    activeSpecId: null,
    count: 1,
    cartCount: 0
  },

  async onLoad(query) {
    const id = Number(query.id);
    const detail = await api.getGoodsDetail(id);
    this.setData({
      detail,
      activeSpecId: detail.specs[0].id
    });
    this.refreshCart();
  },

  onSwiperChange(e) {
    this.setData({ bannerIndex: e.detail.current });
  },

  // 打开规格弹层
  openSpec(e) {
    this.setData({
      showSpec: true,
      specAction: e.currentTarget.dataset.action,
      count: 1
    });
  },
  closeSpec() {
    this.setData({ showSpec: false });
  },

  selectSpec(e) {
    this.setData({ activeSpecId: Number(e.currentTarget.dataset.id) });
  },

  changeCount(e) {
    const delta = Number(e.currentTarget.dataset.delta);
    const count = Math.max(1, this.data.count + delta);
    this.setData({ count });
  },

  // 确认：加入购物车 or 立即购买
  confirmSpec() {
    const { detail, activeSpecId, count, specAction } = this.data;
    const spec = detail.specs.find((s) => s.id === activeSpecId);

    for (let i = 0; i < count; i++) {
      app.addToCart({
        id: spec.id, // 用规格 id 作为购物车行的唯一标识
        name: detail.name,
        spec: spec.label,
        price: spec.price
      });
    }
    this.setData({ showSpec: false });
    this.refreshCart();

    if (specAction === "buy") {
      wx.switchTab({ url: "/pages/cart/cart" });
    } else {
      wx.showToast({ title: "已加入购物车", icon: "success" });
    }
  },

  refreshCart() {
    this.setData({
      cartCount: app.globalData.cart.reduce((n, i) => n + i.count, 0)
    });
  },

  goCart() {
    wx.switchTab({ url: "/pages/cart/cart" });
  }
});
