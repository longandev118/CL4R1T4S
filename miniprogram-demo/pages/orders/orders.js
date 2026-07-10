const api = require("../../api/goods");

const STATUS = [
  { key: "all", label: "全部" },
  { key: "unpaid", label: "待付款" },
  { key: "pending", label: "待收货" },
  { key: "done", label: "已完成" }
];

const STATUS_TEXT = { unpaid: "待付款", pending: "待收货", done: "已完成" };

Page({
  data: {
    statusTabs: STATUS,
    active: "all",
    orders: []
  },

  onLoad(query) {
    const active = query.status || "all";
    this.setData({ active });
    this.load(active);
  },

  onSwitch(e) {
    const active = e.currentTarget.dataset.key;
    this.setData({ active });
    this.load(active);
  },

  async load(status) {
    const orders = await api.getOrders(status);
    // 补充状态中文 + 每单件数
    const list = orders.map((o) => ({
      ...o,
      statusText: STATUS_TEXT[o.status] || o.status,
      totalCount: o.items.reduce((n, i) => n + i.count, 0)
    }));
    this.setData({ orders: list });
  },

  goIndex() {
    wx.switchTab({ url: "/pages/index/index" });
  }
});
