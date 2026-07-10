import { useEffect, useState } from "react";
import Taro, { useDidShow } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { getBanner, getGoodsList } from "../../api/goods";
import { cartStore } from "../../store/cart";
import "./index.scss";

const TABS = ["好果报恩", "超值必买", "好吃推荐"];

export default function Index() {
  const [banner, setBanner] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ count: 0, total: "0.00" });

  useEffect(() => {
    getBanner().then(setBanner);
  }, []);

  useEffect(() => {
    getGoodsList(activeTab).then(setProducts);
  }, [activeTab]);

  const refreshCart = () =>
    setCart({ count: cartStore.count(), total: cartStore.total().toFixed(2) });

  useDidShow(refreshCart);

  const addCart = (p) => {
    cartStore.add({ id: p.id, name: p.name, spec: "默认规格", price: p.price });
    refreshCart();
    Taro.showToast({ title: "已加入购物车", icon: "success" });
  };

  const goCart = () => Taro.switchTab({ url: "/pages/cart/cart" });

  return (
    <View className="page">
      {/* Banner */}
      <View className="banner">
        <View className="banner-header">百果园 好果报恩 第40期</View>
        <View className="banner-card">
          <View className="banner-title">{banner.title}</View>
          <View className="banner-sub">{banner.subtitle}</View>
          <View className="banner-price-row">
            <Text className="old-price">¥{banner.oldPrice}</Text>
            <Text className="big-price price">{banner.price}</Text>
            <Text className="unit">{banner.unit}</Text>
          </View>
          <View className="banner-period">{banner.period}</View>
        </View>
      </View>

      {/* Tabs */}
      <View className="tabs">
        {TABS.map((t, i) => (
          <View
            key={t}
            className={`tab ${activeTab === i ? "tab-active" : ""}`}
            onClick={() => setActiveTab(i)}
          >
            {t}
          </View>
        ))}
      </View>

      {/* 商品列表 */}
      <View className="product-list">
        {products.map((item) => (
          <View className="product-card" key={item.id}>
            <View className="product-img">图</View>
            <View className="product-info">
              <View className="product-name">
                <Text className="product-tag">{item.tag}</Text>
                {item.name}
              </View>
              <View className="product-desc">{item.desc}</View>
              <View className="product-bottom">
                <Text className="price">
                  <Text className="rmb">¥</Text>
                  {item.price}
                </Text>
                <View className="btn-primary spec-btn" onClick={() => addCart(item)}>
                  选规格
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* 底部购物车栏 */}
      <View className="cart-bar">
        <View className="cart-icon" onClick={goCart}>
          🛒
          {cart.count > 0 && <Text className="cart-badge">{cart.count}</Text>}
        </View>
        <View className="cart-total">
          合计 <Text className="price">¥{cart.total}</Text>
        </View>
        <View className="btn-primary checkout-btn" onClick={goCart}>
          结算
        </View>
      </View>
    </View>
  );
}
