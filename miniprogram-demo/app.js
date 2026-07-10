const config = require("./config");

App({
  // 全局数据：购物车在多个页面间共享
  globalData: {
    cart: [] // [{ id, name, spec, price, count }]
  },

  onLaunch() {
    // 云开发模式下初始化云环境
    if (config.dataSource === "cloud") {
      if (!wx.cloud) {
        console.error("请使用 2.2.3 或以上的基础库以使用云能力");
      } else {
        wx.cloud.init({ env: config.cloudEnv, traceUser: true });
      }
    }
    // 可在此调用 wx.login 获取登录态、拉取用户信息等
  },

  // ---- 购物车工具方法（供各页面调用）----
  addToCart(item) {
    const cart = this.globalData.cart;
    const found = cart.find((i) => i.id === item.id);
    if (found) {
      found.count += 1;
    } else {
      cart.push({ ...item, count: 1 });
    }
  },

  getCartTotal() {
    return this.globalData.cart.reduce(
      (sum, i) => sum + i.price * i.count,
      0
    );
  }
});
