const app = getApp();
const api = require("../../api/goods");

Page({
  data: {
    userInfo: null
  },

  onShow() {
    this.setData({ userInfo: app.globalData.userInfo });
  },

  // 微信登录：getUserProfile 必须在点击事件里直接调用
  async onLogin() {
    try {
      const profile = await wx.getUserProfile({ desc: "用于完善会员资料" });
      // 换取 openid（云开发走云函数，http 走 wx.login + 后端）
      const { openid } = await api.login();
      const userInfo = {
        avatarUrl: profile.userInfo.avatarUrl,
        nickName: profile.userInfo.nickName,
        openid
      };
      app.setUserInfo(userInfo);
      this.setData({ userInfo });
      wx.showToast({ title: "登录成功", icon: "success" });
    } catch (e) {
      wx.showToast({ title: "已取消登录", icon: "none" });
    }
  },

  onLogout() {
    app.logout();
    this.setData({ userInfo: null });
  },

  goOrders(e) {
    const status = e.currentTarget.dataset.status || "all";
    wx.navigateTo({ url: `/pages/orders/orders?status=${status}` });
  },

  goCart() {
    wx.switchTab({ url: "/pages/cart/cart" });
  }
});
