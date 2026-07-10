const config = require("../config");
const { request } = require("../utils/request");
const mock = require("../mock/data");

// 模拟网络延迟，让 mock 更接近真实体验
function mockResolve(data, delay = 200) {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
}

// 首页活动 Banner
function getBanner() {
  if (config.useMock) return mockResolve(mock.banner);
  return request("/banner");
}

// 某分类下的商品列表
function getGoodsList(tabIndex) {
  if (config.useMock) return mockResolve(mock.goodsList[tabIndex] || []);
  return request("/goods", { data: { tab: tabIndex } });
}

// 商品详情
function getGoodsDetail(id) {
  if (config.useMock) return mockResolve(mock.goodsDetail[id]);
  return request(`/goods/${id}`);
}

// 提交订单
function createOrder(items) {
  if (config.useMock) return mockResolve({ orderId: "MOCK_" + items.length });
  return request("/order", { method: "POST", data: { items } });
}

module.exports = { getBanner, getGoodsList, getGoodsDetail, createOrder };
