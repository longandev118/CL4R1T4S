const config = require("../config");
const { request } = require("../utils/request");
const mock = require("../mock/data");

// 模拟网络延迟，让 mock 更接近真实体验
function mockResolve(data, delay = 200) {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
}

// 走微信云开发：调用云函数
function callCloud(name, data) {
  return wx.cloud
    .callFunction({ name, data })
    .then((res) => res.result);
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

// 提交订单
function createOrder(items) {
  if (config.dataSource === "mock") {
    return mockResolve({ orderId: "MOCK_" + items.length });
  }
  if (config.dataSource === "cloud") return callCloud("createOrder", { items });
  return request("/order", { method: "POST", data: { items } });
}

module.exports = { getBanner, getGoodsList, getGoodsDetail, createOrder };
