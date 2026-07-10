// 云函数：按关键词搜索商品
const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const GOODS = [
  { id: 1, name: "奶皇杏（中） 1份/约250g", desc: "小个头大甜头", tag: "招牌", price: 12.95 },
  { id: 2, name: "佳沛阳光金奇异果 1份/约500g", desc: "进口金果", tag: "必买", price: 29.9 },
  { id: 3, name: "海南贵妃芒 1份/约600g", desc: "香甜软糯", tag: "推荐", price: 19.9 },
  { id: 5, name: "麒麟西瓜 1份/约4kg", desc: "沙瓤爆甜", tag: "报恩", price: 35.9 },
  { id: 9, name: "智利车厘子 1份/约1kg", desc: "脆甜多汁", tag: "必买", price: 89.9 }
];

exports.main = async (event) => {
  const kw = (event.keyword || "").trim();
  if (!kw) return [];
  // 演示内存过滤；真实项目用云数据库正则查询：
  //   db.collection("goods").where({ name: db.RegExp({ regexp: kw, options: "i" }) })
  return GOODS.filter((g) => g.name.includes(kw) || g.desc.includes(kw));
};
