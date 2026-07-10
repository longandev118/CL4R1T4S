const app = getApp();

Page({
  data: {
    cart: [],
    total: "0.00"
  },

  onShow() {
    this.refresh();
  },

  refresh() {
    this.setData({
      cart: app.globalData.cart,
      total: app.getCartTotal().toFixed(2)
    });
  },

  // 增减数量
  onStep(e) {
    const { id, delta } = e.currentTarget.dataset;
    const cart = app.globalData.cart;
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    item.count += Number(delta);
    if (item.count <= 0) {
      app.globalData.cart = cart.filter((i) => i.id !== id);
    }
    this.refresh();
  },

  onCheckout() {
    if (app.globalData.cart.length === 0) {
      wx.showToast({ title: "购物车是空的", icon: "none" });
      return;
    }
    // 真实项目：调用下单接口 + wx.requestPayment 拉起微信支付
    wx.showToast({ title: "下单成功（示例）", icon: "success" });
    app.globalData.cart = [];
    this.refresh();
  }
});
