// 云函数：微信登录，直接返回当前用户 openid（云开发免去 code 换取步骤）
const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async () => {
  const { OPENID, APPID, UNIONID } = cloud.getWXContext();
  return { openid: OPENID, appid: APPID, unionid: UNIONID };
};
