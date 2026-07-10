# 百果园风格电商小程序 · Taro (React) 版本

与 `../miniprogram-demo`（原生版）功能一致，但用 **Taro + React** 编写，一套代码可编译到微信小程序 / 支付宝 / H5 等多端。

## 为什么用 Taro

- 用 **React（JSX + hooks）** 写，组件化、生态成熟
- `npm run build:weapp` 编译成微信小程序；`build:h5` 编译成网页；还能出支付宝/抖音等
- 适合已有 React 经验、或需要多端复用的团队

## 跑起来

```bash
cd taro-version
npm install            # 安装依赖（需要 Node 16+）

# 微信小程序：编译后用微信开发者工具导入 dist/ 目录
npm run dev:weapp

# 或直接在浏览器看 H5 版
npm run dev:h5
```

> 编译微信端后，用微信开发者工具**导入本项目的 `dist/` 目录**（不是根目录）。

## 目录结构

```
taro-version/
├── config/index.js         # Taro 编译配置（designWidth 750）
├── babel.config.js
├── project.config.json
└── src/
    ├── app.js / app.config.js / app.scss   # 入口与全局页面/tabBar 配置
    ├── api/goods.js         # 接口层（useMock 开关，真/假数据切换）
    ├── store/cart.js        # 全局购物车（发布订阅，跨页面共享）
    └── pages/
        ├── index/           # 首页：Banner + Tab + 商品卡片 + 购物车栏
        └── cart/            # 购物车页
```

## 与原生版的对应关系

| 原生小程序 | Taro |
| --- | --- |
| `.wxml` | JSX（`<View>`/`<Text>` 等组件） |
| `.wxss`（rpx） | `.scss`（px，`designWidth:750` 自动换算） |
| `Page({data, setData})` | React 函数组件 + `useState` |
| `app.globalData` | `src/store/cart.js` 发布订阅 store |
| `wx.request` | `Taro.request` |
| `wx.navigateTo` / `switchTab` | `Taro.navigateTo` / `Taro.switchTab` |

## 接真实后端

改 `src/api/goods.js` 顶部：`useMock = false`，并把 `baseURL` 换成你的域名（记得在小程序后台配置 request 合法域名）。支付同理，用 `Taro.requestPayment`。
