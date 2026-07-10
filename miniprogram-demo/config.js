// 全局配置
module.exports = {
  // 后端接口基地址（换成你自己的域名，需在小程序后台配置 request 合法域名）
  baseURL: "https://api.example.com",

  // true = 使用本地 mock 数据（无需后端即可跑通）
  // false = 走真实 wx.request 请求 baseURL
  useMock: true
};
