// 云函数：分页获取分类商品
const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

// 演示用全量数据；真实项目改为查询云数据库 goods 集合
const GOODS = {
  0: [
    { id: 1, name: "【腾格尔同款】奶皇杏（中） 1份/约250g", desc: "小个头大甜头", tag: "招牌", price: 12.95 },
    { id: 4, name: "阳山水蜜桃 1份/约500g", desc: "皮薄多汁", tag: "报恩", price: 22.9 },
    { id: 5, name: "麒麟西瓜 1份/约4kg", desc: "沙瓤爆甜", tag: "报恩", price: 35.9 },
    { id: 6, name: "妃子笑荔枝 1份/约500g", desc: "核小肉厚", tag: "报恩", price: 18.8 }
  ],
  1: [
    { id: 2, name: "佳沛阳光金奇异果 1份/约500g", desc: "进口金果", tag: "必买", price: 29.9 },
    { id: 8, name: "泰国金枕榴莲 1份/约2kg", desc: "浓香软糯", tag: "必买", price: 128.0 }
  ],
  2: [
    { id: 3, name: "海南贵妃芒 1份/约600g", desc: "香甜软糯", tag: "推荐", price: 19.9 },
    { id: 11, name: "赣南脐橙 1份/约1kg", desc: "多汁化渣", tag: "推荐", price: 21.9 }
  ]
};

exports.main = async (event) => {
  const { tab = 0, page = 1, pageSize = 3 } = event;
  const all = GOODS[tab] || [];
  const start = (page - 1) * pageSize;
  const list = all.slice(start, start + pageSize);
  // 真实项目：
  //   const db = cloud.database();
  //   const res = await db.collection("goods").where({ tab })
  //     .skip(start).limit(pageSize).get();
  return { list, total: all.length, hasMore: start + pageSize < all.length };
};
