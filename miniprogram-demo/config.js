// 全局配置
module.exports = {
  // 数据来源，三选一：
  //  "mock"  = 本地假数据（无需后端/云，直接跑通）
  //  "http"  = 走 wx.request 请求下面的 baseURL（传统后端）
  //  "cloud" = 走微信云开发云函数（免服务器，见 cloudfunctions/）
  dataSource: "mock",

  // dataSource="http" 时的后端基地址（需在小程序后台配置 request 合法域名）
  baseURL: "https://api.example.com",

  // dataSource="cloud" 时的云开发环境 ID（在云开发控制台创建后填这里）
  cloudEnv: "your-cloud-env-id"
};
