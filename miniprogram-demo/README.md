# 百果园风格电商小程序（示例）

复刻截图里的核心页面：顶部活动 Banner、分类切换 Tab、商品卡片列表、底部购物车结算栏，外加一个购物车页。用来演示"怎样做一个这样的微信小程序"。

## 一、这是什么

截图里那种界面是 **微信小程序（WeChat Mini Program）**。它不是普通网页，而是运行在微信里的一套框架：

- **WXML**：结构（类似 HTML）
- **WXSS**：样式（类似 CSS，尺寸单位用 `rpx`，750rpx = 屏幕宽度）
- **JS**：逻辑（`Page` / `App` + 事件绑定 + `setData` 更新界面）
- **JSON**：页面/全局配置（导航栏、tabBar、页面路径等）

## 二、跑起来（5 步）

1. 注册小程序账号：<https://mp.weixin.qq.com> → 拿到 **AppID**（个人也能注册；本示例用 `touristappid` 游客态即可预览）。
2. 下载并安装 **微信开发者工具**：<https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html>
3. 打开开发者工具 → **导入项目** → 选择本 `miniprogram-demo` 目录。
4. AppID 填你自己的，或点"**测试号 / 游客模式**"。
5. 左侧模拟器即可看到界面，改代码自动热重载。

## 三、目录结构

```
miniprogram-demo/
├── app.js          # 小程序入口 + 全局购物车逻辑
├── app.json        # 全局配置：页面列表、导航栏、tabBar
├── app.wxss        # 全局样式
├── config.js       # baseURL + useMock 开关（真/假数据切换）
├── utils/request.js  # Promise 封装的 wx.request
├── api/goods.js    # 业务接口：banner/商品/详情/下单
├── mock/data.js    # 本地 mock 数据（useMock=true 时用）
├── project.config.json
├── sitemap.json
└── pages/
    ├── index/      # 首页（活动页，复刻截图）
    ├── detail/     # 商品详情页（轮播图 + 规格选择弹层 + 加购/购买）
    └── cart/       # 购物车页
```

## 接口层怎么用

- `config.js` 里 `useMock: true` → 用 `mock/data.js` 本地数据，**无需后端就能跑**。
- 有后端后改成 `useMock: false`，并把 `baseURL` 换成你的域名（需在小程序后台配置 request 合法域名）。
- 页面统一调 `api/goods.js`（如 `api.getGoodsList(tab)`），底层走 `utils/request.js`，切换真假数据对页面无感。

## 四、代码里做了什么

- **Banner / 商品数据** 现在写死在 `pages/index/index.js` 的 `data` 里。真实项目应改成 `wx.request` 调后端接口返回。
- **Tab 切换**：点击顶部分类 → `onTabChange` → `setData` 切换商品列表。
- **加入购物车**：商品数据存在 `app.globalData.cart`，跨页面共享；`app.js` 提供 `addToCart` / `getCartTotal`。
- **购物车页**：增减数量、合计金额、结算（示例里只弹 Toast）。

## 五、从示例到真实上线，还差什么

| 能力 | 怎么做 |
| --- | --- |
| 真实商品数据 | 用 `wx.request` 调你的后端 API（或用**微信云开发** `wx.cloud`，免服务器） |
| 图片 | 现在是占位"图"字，替换成 `<image src="...">`，图片放 CDN 或云存储 |
| 登录 | `wx.login` 拿 code → 后端换 openid；`wx.getUserProfile` 拿头像昵称 |
| 支付 | 后端调统一下单 → 小程序 `wx.requestPayment` 拉起微信支付 |
| 上线 | 开发者工具点"上传" → 在 mp.weixin.qq.com 提交审核 → 发布 |

## 六、想更快，可选框架

除了原生开发，也常用这些跨端框架（一套代码多端发布）：
- **Taro**（React/Vue 语法）
- **uni-app**（Vue 语法）
- 微信官方 **云开发**（不用自己搭后端，适合快速验证）

本示例用**原生**写，是为了让你看清小程序最底层的运作方式。
