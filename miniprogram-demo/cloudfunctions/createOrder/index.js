// 云函数：创建订单
const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event) => {
  const { items = [] } = event;
  const { OPENID } = cloud.getWXContext(); // 自动拿到当前用户 openid
  const amount = items.reduce((sum, i) => sum + i.price * i.count, 0);

  // 真实项目：写入云数据库 orders 集合，再对接微信支付统一下单
  //   const db = cloud.database();
  //   const res = await db.collection("orders").add({
  //     data: { openid: OPENID, items, amount, status: "unpaid", createdAt: new Date() }
  //   });
  //   return { orderId: res._id, amount };

  return {
    orderId: "CLOUD_" + Date.now(),
    openid: OPENID,
    amount: +amount.toFixed(2)
  };
};
