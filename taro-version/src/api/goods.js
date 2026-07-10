import Taro from "@tarojs/taro";

// true = 本地 mock，无需后端即可跑通；false = 走真实 Taro.request
const useMock = true;
const baseURL = "https://api.example.com";

const mock = {
  banner: {
    title: "招牌·奶皇杏（中）",
    subtitle: "新疆时令鲜果，小个头大甜头",
    oldPrice: "29.50",
    price: "25.9",
    unit: "元/500g",
    period: "活动时间：2026年7月7日-7月22日"
  },
  goodsList: {
    0: [{ id: 1, name: "【腾格尔同款】奶皇杏（中） 1份/约250g", desc: '来自新疆的小确"杏"', tag: "招牌", price: 12.95 }],
    1: [{ id: 2, name: "佳沛阳光金奇异果 1份/约500g", desc: "进口金果，酸甜多汁", tag: "必买", price: 29.9 }],
    2: [{ id: 3, name: "海南贵妃芒 1份/约600g", desc: "皮薄核小，香甜软糯", tag: "推荐", price: 19.9 }]
  }
};

function mockResolve(data, delay = 200) {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
}

export function getBanner() {
  if (useMock) return mockResolve(mock.banner);
  return Taro.request({ url: `${baseURL}/banner` }).then((r) => r.data.data);
}

export function getGoodsList(tabIndex) {
  if (useMock) return mockResolve(mock.goodsList[tabIndex] || []);
  return Taro.request({ url: `${baseURL}/goods`, data: { tab: tabIndex } }).then((r) => r.data.data);
}

export function createOrder(items) {
  if (useMock) return mockResolve({ orderId: "MOCK_" + items.length });
  return Taro.request({ url: `${baseURL}/order`, method: "POST", data: { items } }).then((r) => r.data.data);
}
