const config = require("../config");
const { request } = require("../utils/request");
const mock = require("../mock/data");

// 模拟网络延迟，让 mock 更接近真实体验
function mockResolve(data, delay = 200) {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
}

// 走微信云开发：调用云函数
function callCloud(name, data) {
  return wx.cloud.callFunction({ name, data }).then((res) => res.result);
}

// 首页活动 Banner
function getBanner() {
  if (config.dataSource === "mock") return mockResolve(mock.banner);
  if (config.dataSource === "cloud") return callCloud("getBanner", {});
  return request("/banner");
}

// 分类商品（分页）：返回 { list, total, hasMore }
function getGoodsList(tabIndex, page = 1, pageSize = 3) {
  if (config.dataSource === "mock") {
    return mockResolve(mock.pageGoods(tabIndex, page, pageSize));
  }
  if (config.dataSource === "cloud") {
    return callCloud("getGoods", { tab: tabIndex, page, pageSize });
  }
  return request("/goods", { data: { tab: tabIndex, page, pageSize } });
}

// 商品详情
function getGoodsDetail(id) {
  if (config.dataSource === "mock") return mockResolve(mock.getDetail(id));
  if (config.dataSource === "cloud") return callCloud("getGoodsDetail", { id });
  return request(`/goods/${id}`);
}

// 关键词搜索商品
function searchGoods(keyword) {
  if (config.dataSource === "mock") {
    const kw = (keyword || "").trim();
    const all = mock.allGoods();
    const list = kw ? all.filter((g) => g.name.includes(kw) || g.desc.includes(kw)) : [];
    return mockResolve(list, 150);
  }
  if (config.dataSource === "cloud") return callCloud("searchGoods", { keyword });
  return request("/search", { data: { keyword } });
}

// 微信登录：换取 openid（云开发用云函数，http 用 wx.login+后端）
function login() {
  if (config.dataSource === "mock") {
    return mockResolve({ openid: "mock_openid_8888" });
  }
  if (config.dataSource === "cloud") return callCloud("login", {});
  return new Promise((resolve, reject) => {
    wx.login({
      success: (r) =>
        request("/login", { method: "POST", data: { code: r.code } }).then(resolve, reject),
      fail: reject
    });
  });
}

// 提交订单（mock 下写入本地 storage 以便"我的订单"能看到）
function createOrder(items) {
  const amount = items.reduce((s, i) => s + i.price * i.count, 0);
  if (config.dataSource === "mock") {
    const order = {
      orderId: "MOCK_" + Date.now(),
      items,
      amount: +amount.toFixed(2),
      status: "pending", // 待收货
      createdAt: new Date().toLocaleString()
    };
    const all = wx.getStorageSync("orders") || [];
    all.unshift(order);
    wx.setStorageSync("orders", all);
    return mockResolve({ orderId: order.orderId });
  }
  if (config.dataSource === "cloud") return callCloud("createOrder", { items });
  return request("/order", { method: "POST", data: { items } });
}

// 我的订单（按状态过滤，status: all/unpaid/pending/done）
function getOrders(status = "all") {
  if (config.dataSource === "mock") {
    const all = wx.getStorageSync("orders") || [];
    const list = status === "all" ? all : all.filter((o) => o.status === status);
    return mockResolve(list);
  }
  if (config.dataSource === "cloud") return callCloud("getOrders", { status });
  return request("/orders", { data: { status } });
}

module.exports = {
  getBanner,
  getGoodsList,
  getGoodsDetail,
  searchGoods,
  login,
  createOrder,
  getOrders
};
