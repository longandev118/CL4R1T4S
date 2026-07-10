// 云函数：获取商品详情
const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event) => {
  const { id } = event;
  // 演示按 id 兜底生成；真实项目从云数据库 goods 集合按 _id 查
  const base = { 1: "奶皇杏", 2: "阳光金奇异果", 3: "海南贵妃芒" }[id] || "时令鲜果";
  return {
    id,
    name: `${base} 商品详情`,
    desc: "新鲜直供，产地现摘，品质保证。",
    banner: ["图1", "图2", "图3"],
    specs: [
      { id: id * 10 + 1, label: "标准装", price: 19.9 },
      { id: id * 10 + 2, label: "家庭装", price: 35.9 }
    ],
    detailImages: ["详情图A", "详情图B"]
  };
};
