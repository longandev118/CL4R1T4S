// 云函数：创建订单（写入云数据库 orders 集合）
const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event) => {
  const { items = [] } = event;
  const { OPENID } = cloud.getWXContext(); // 自动拿到当前用户 openid
  const amount = +items.reduce((sum, i) => sum + i.price * i.count, 0).toFixed(2);
  const db = cloud.database();

  // 写入订单（_openid 由云开发自动注入，也可显式存）
  const res = await db.collection("orders").add({
    data: {
      items,
      amount,
      status: "pending", // 待收货；接入支付后按支付结果改为 unpaid/paid
      createdAt: new Date().toLocaleString()
    }
  });

  // 真实项目：此处对接微信支付统一下单，返回支付参数给前端 wx.requestPayment
  return { orderId: res._id, openid: OPENID, amount };
};
