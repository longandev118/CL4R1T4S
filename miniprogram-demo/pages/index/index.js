const app = getApp();

Page({
  data: {
    // 顶部活动信息
    banner: {
      title: "招牌·奶皇杏（中）",
      subtitle: "新疆时令鲜果，小个头大甜头",
      oldPrice: "29.50",
      price: "25.9",
      unit: "元/500g",
      period: "活动时间：2026年7月7日-7月22日"
    },
    // 分类 Tab
    tabs: ["好果报恩", "超值必买", "好吃推荐"],
    activeTab: 0,
    // 各 Tab 下的商品（真实项目里应由后端接口返回）
    productsByTab: [
      [
        {
          id: 1,
          name: "【腾格尔同款】奶皇杏（中） 1份/约250g",
          desc: "来自新疆的小确\"杏\"，小个头大甜头",
          tag: "招牌",
          price: 12.95
        }
      ],
      [
        {
          id: 2,
          name: "佳沛阳光金奇异果 1份/约500g",
          desc: "进口金果，酸甜多汁",
          tag: "必买",
          price: 29.9
        }
      ],
      [
        {
          id: 3,
          name: "海南贵妃芒 1份/约600g",
          desc: "皮薄核小，香甜软糯",
          tag: "推荐",
          price: 19.9
        }
      ]
    ],
    products: [],
    cartCount: 0,
    cartTotal: "0.00"
  },

  onLoad() {
    this.setProducts();
    this.refreshCart();
  },

  onShow() {
    this.refreshCart();
  },

  // 切换分类 Tab
  onTabChange(e) {
    const index = Number(e.currentTarget.dataset.index);
    this.setData({ activeTab: index }, () => this.setProducts());
  },

  setProducts() {
    this.setData({
      products: this.data.productsByTab[this.data.activeTab] || []
    });
  },

  // 加入购物车
  onAddCart(e) {
    const product = e.currentTarget.dataset.product;
    app.addToCart({
      id: product.id,
      name: product.name,
      spec: "默认规格",
      price: product.price
    });
    this.refreshCart();
    wx.showToast({ title: "已加入购物车", icon: "success" });
  },

  refreshCart() {
    const cart = app.globalData.cart;
    this.setData({
      cartCount: cart.reduce((n, i) => n + i.count, 0),
      cartTotal: app.getCartTotal().toFixed(2)
    });
  },

  goCart() {
    wx.switchTab({ url: "/pages/cart/cart" });
  }
});
