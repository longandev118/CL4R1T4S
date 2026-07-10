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
    0: [
      { id: 1, name: "【腾格尔同款】奶皇杏（中） 1份/约250g", desc: '来自新疆的小确"杏"', tag: "招牌", price: 12.95 },
      { id: 4, name: "阳山水蜜桃 1份/约500g", desc: "皮薄多汁，入口即化", tag: "报恩", price: 22.9 },
      { id: 5, name: "麒麟西瓜 1份/约4kg", desc: "沙瓤爆甜", tag: "报恩", price: 35.9 },
      { id: 6, name: "妃子笑荔枝 1份/约500g", desc: "核小肉厚", tag: "报恩", price: 18.8 }
    ],
    1: [
      { id: 2, name: "佳沛阳光金奇异果 1份/约500g", desc: "进口金果，酸甜多汁", tag: "必买", price: 29.9 },
      { id: 8, name: "泰国金枕榴莲 1份/约2kg", desc: "浓香软糯", tag: "必买", price: 128.0 }
    ],
    2: [
      { id: 3, name: "海南贵妃芒 1份/约600g", desc: "皮薄核小，香甜软糯", tag: "推荐", price: 19.9 },
      { id: 11, name: "赣南脐橙 1份/约1kg", desc: "多汁化渣", tag: "推荐", price: 21.9 }
    ]
  }
};

function mockResolve(data, delay = 200) {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
}

function findGoods(id) {
  for (const key of Object.keys(mock.goodsList)) {
    const g = mock.goodsList[key].find((x) => x.id === id);
    if (g) return g;
  }
  return null;
}

export function getBanner() {
  if (useMock) return mockResolve(mock.banner);
  return Taro.request({ url: `${baseURL}/banner` }).then((r) => r.data.data);
}

// 分页：返回 { list, total, hasMore }
export function getGoodsList(tabIndex, page = 1, pageSize = 3) {
  if (useMock) {
    const all = mock.goodsList[tabIndex] || [];
    const start = (page - 1) * pageSize;
    return mockResolve({
      list: all.slice(start, start + pageSize),
      total: all.length,
      hasMore: start + pageSize < all.length
    });
  }
  return Taro.request({ url: `${baseURL}/goods`, data: { tab: tabIndex, page, pageSize } }).then((r) => r.data.data);
}

export function getGoodsDetail(id) {
  if (useMock) {
    const g = findGoods(id);
    return mockResolve(
      g && {
        id: g.id,
        name: g.name,
        desc: g.desc,
        banner: ["图1", "图2", "图3"],
        specs: [
          { id: g.id * 10 + 1, label: "标准装", price: g.price },
          { id: g.id * 10 + 2, label: "家庭装", price: +(g.price * 1.8).toFixed(1) }
        ],
        detailImages: ["详情图A", "详情图B"]
      }
    );
  }
  return Taro.request({ url: `${baseURL}/goods/${id}` }).then((r) => r.data.data);
}

export function createOrder(items) {
  if (useMock) return mockResolve({ orderId: "MOCK_" + items.length });
  return Taro.request({ url: `${baseURL}/order`, method: "POST", data: { items } }).then((r) => r.data.data);
}
