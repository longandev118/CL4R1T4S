// 云函数：获取当前用户订单（按状态过滤）
const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event) => {
  const { status = "all" } = event;
  const { OPENID } = cloud.getWXContext();
  const db = cloud.database();

  const where = { _openid: OPENID };
  if (status !== "all") where.status = status;

  const res = await db
    .collection("orders")
    .where(where)
    .orderBy("createdAt", "desc")
    .get();
  return res.data;
};
