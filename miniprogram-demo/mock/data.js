// 本地 mock 数据：config.useMock=true 时使用，无需后端即可跑通
const banner = {
  title: "招牌·奶皇杏（中）",
  subtitle: "新疆时令鲜果，小个头大甜头",
  oldPrice: "29.50",
  price: "25.9",
  unit: "元/500g",
  period: "活动时间：2026年7月7日-7月22日"
};

// 每个分类下的完整商品数据（模拟数据库里的全量数据，用于演示分页）
const goodsList = {
  0: [
    { id: 1, name: "【腾格尔同款】奶皇杏（中） 1份/约250g", desc: "来自新疆的小确\"杏\"，小个头大甜头", tag: "招牌", price: 12.95 },
    { id: 4, name: "阳山水蜜桃 1份/约500g", desc: "皮薄多汁，入口即化", tag: "报恩", price: 22.9 },
    { id: 5, name: "麒麟西瓜 1份/约4kg", desc: "沙瓤爆甜，夏日必备", tag: "报恩", price: 35.9 },
    { id: 6, name: "妃子笑荔枝 1份/约500g", desc: "核小肉厚，清甜爽口", tag: "报恩", price: 18.8 },
    { id: 7, name: "巨峰葡萄 1份/约750g", desc: "颗颗饱满，酸甜浓郁", tag: "报恩", price: 16.9 }
  ],
  1: [
    { id: 2, name: "佳沛阳光金奇异果 1份/约500g", desc: "进口金果，酸甜多汁", tag: "必买", price: 29.9 },
    { id: 8, name: "泰国金枕榴莲 1份/约2kg", desc: "浓香软糯，甜到心里", tag: "必买", price: 128.0 },
    { id: 9, name: "智利车厘子 1份/约1kg", desc: "大颗紧实，脆甜多汁", tag: "必买", price: 89.9 },
    { id: 10, name: "红心火龙果 1份/约600g", desc: "果肉红润，清甜低卡", tag: "必买", price: 25.9 }
  ],
  2: [
    { id: 3, name: "海南贵妃芒 1份/约600g", desc: "皮薄核小，香甜软糯", tag: "推荐", price: 19.9 },
    { id: 11, name: "赣南脐橙 1份/约1kg", desc: "多汁化渣，酸甜可口", tag: "推荐", price: 21.9 },
    { id: 12, name: "烟台红富士苹果 1份/约1kg", desc: "脆甜爽口，经典好味", tag: "推荐", price: 17.9 }
  ]
};

// 分页取数：返回 { list, total, hasMore }
function pageGoods(tabIndex, page = 1, pageSize = 3) {
  const all = goodsList[tabIndex] || [];
  const start = (page - 1) * pageSize;
  const list = all.slice(start, start + pageSize);
  return { list, total: all.length, hasMore: start + pageSize < all.length };
}

// 商品详情（含多规格、图文详情）
const goodsDetail = {
  1: {
    id: 1,
    name: "【腾格尔同款】奶皇杏（中） 1份/约250g",
    desc: "来自新疆的小确\"杏\"，小个头大甜头。皮薄多汁，入口清甜。",
    banner: ["图1", "图2", "图3"],
    specs: [
      { id: 11, label: "中果 约250g", price: 12.95 },
      { id: 12, label: "大果 约500g", price: 25.9 },
      { id: 13, label: "家庭装 约1kg", price: 49.9 }
    ],
    detailImages: ["详情图A", "详情图B"]
  },
  2: {
    id: 2,
    name: "佳沛阳光金奇异果 1份/约500g",
    desc: "进口金果，酸甜多汁，维C满满。",
    banner: ["图1", "图2"],
    specs: [
      { id: 21, label: "500g", price: 29.9 },
      { id: 22, label: "1kg", price: 55.0 }
    ],
    detailImages: ["详情图A"]
  },
  3: {
    id: 3,
    name: "海南贵妃芒 1份/约600g",
    desc: "皮薄核小，香甜软糯。",
    banner: ["图1"],
    specs: [
      { id: 31, label: "600g", price: 19.9 },
      { id: 32, label: "3斤装", price: 45.0 }
    ],
    detailImages: ["详情图A"]
  }
};

// 找到某商品在列表里的基础信息（用于给没写详情的商品兜底生成详情）
function findGoods(id) {
  for (const key of Object.keys(goodsList)) {
    const found = goodsList[key].find((g) => g.id === id);
    if (found) return found;
  }
  return null;
}

// 取商品详情：优先用精编详情，没有则按列表信息兜底生成
function getDetail(id) {
  if (goodsDetail[id]) return goodsDetail[id];
  const g = findGoods(id);
  if (!g) return null;
  return {
    id: g.id,
    name: g.name,
    desc: g.desc,
    banner: ["图1", "图2"],
    specs: [
      { id: g.id * 10 + 1, label: "标准装", price: g.price },
      { id: g.id * 10 + 2, label: "家庭装", price: +(g.price * 1.8).toFixed(1) }
    ],
    detailImages: ["详情图A"]
  };
}

// 全部商品打平成一维数组（供搜索用）
function allGoods() {
  return Object.keys(goodsList).reduce((arr, k) => arr.concat(goodsList[k]), []);
}

module.exports = { banner, goodsList, goodsDetail, pageGoods, getDetail, allGoods };
