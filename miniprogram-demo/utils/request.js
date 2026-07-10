const config = require("../config");

// Promise 封装的 wx.request，统一处理 loading / 错误 / 鉴权头
function request(url, { method = "GET", data = {}, loading = true } = {}) {
  return new Promise((resolve, reject) => {
    if (loading) wx.showLoading({ title: "加载中", mask: true });

    wx.request({
      url: config.baseURL + url,
      method,
      data,
      header: {
        "content-type": "application/json",
        // 真实项目在这里带上登录态，例如：
        // Authorization: wx.getStorageSync("token")
      },
      success(res) {
        // 约定后端返回 { code, data, msg }
        const body = res.data || {};
        if (res.statusCode === 200 && body.code === 0) {
          resolve(body.data);
        } else {
          wx.showToast({ title: body.msg || "请求失败", icon: "none" });
          reject(body);
        }
      },
      fail(err) {
        wx.showToast({ title: "网络异常", icon: "none" });
        reject(err);
      },
      complete() {
        if (loading) wx.hideLoading();
      }
    });
  });
}

module.exports = { request };
