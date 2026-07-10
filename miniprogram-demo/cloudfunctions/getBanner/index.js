// 云函数：获取首页活动 Banner
const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async () => {
  // 演示直接返回；真实项目从云数据库读：
  //   const db = cloud.database();
  //   const res = await db.collection("banner").limit(1).get();
  //   return res.data[0];
  return {
    title: "招牌·奶皇杏（中）",
    subtitle: "新疆时令鲜果，小个头大甜头",
    oldPrice: "29.50",
    price: "25.9",
    unit: "元/500g",
    period: "活动时间：2026年7月7日-7月22日"
  };
};
