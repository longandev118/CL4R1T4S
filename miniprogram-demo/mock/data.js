// 本地 mock 数据：config.useMock=true 时使用，无需后端即可跑通
const banner = {
  title: "招牌·奶皇杏（中）",
  subtitle: "新疆时令鲜果，小个头大甜头",
  oldPrice: "29.50",
  price: "25.9",
  unit: "元/500g",
  period: "活动时间：2026年7月7日-7月22日"
};

const goodsList = {
  0: [
    {
      id: 1,
      name: "【腾格尔同款】奶皇杏（中） 1份/约250g",
      desc: "来自新疆的小确\"杏\"，小个头大甜头",
      tag: "招牌",
      price: 12.95
    }
  ],
  1: [
    {
      id: 2,
      name: "佳沛阳光金奇异果 1份/约500g",
      desc: "进口金果，酸甜多汁",
      tag: "必买",
      price: 29.9
    }
  ],
  2: [
    {
      id: 3,
      name: "海南贵妃芒 1份/约600g",
      desc: "皮薄核小，香甜软糯",
      tag: "推荐",
      price: 19.9
    }
  ]
};

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

module.exports = { banner, goodsList, goodsDetail };
