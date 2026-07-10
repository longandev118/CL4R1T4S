import { useEffect, useState, useRef } from "react";
import Taro, { useDidShow, usePullDownRefresh, useReachBottom } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { getBanner, getGoodsList } from "../../api/goods";
import { cartStore } from "../../store/cart";
import "./index.scss";

const TABS = ["好果报恩", "超值必买", "好吃推荐"];
const PAGE_SIZE = 3;

export default function Index() {
  const [banner, setBanner] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cart, setCart] = useState({ count: 0, total: "0.00" });
  const pageRef = useRef(1);

  const loadPage = async (tab, page, append = false) => {
    const { list, hasMore: more } = await getGoodsList(tab, page, PAGE_SIZE);
    pageRef.current = page;
    setHasMore(more);
    setProducts((prev) => (append ? prev.concat(list) : list));
    setLoadingMore(false);
  };

  useEffect(() => {
    getBanner().then(setBanner);
  }, []);

  useEffect(() => {
    setProducts([]);
    setHasMore(true);
    loadPage(activeTab, 1);
  }, [activeTab]);

  const refreshCart = () =>
    setCart({ count: cartStore.count(), total: cartStore.total().toFixed(2) });
  useDidShow(refreshCart);

  usePullDownRefresh(async () => {
    await Promise.all([getBanner().then(setBanner), loadPage(activeTab, 1)]);
    Taro.stopPullDownRefresh();
  });

  useReachBottom(() => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    loadPage(activeTab, pageRef.current + 1, true);
  });

  const goDetail = (id) => Taro.navigateTo({ url: `/pages/detail/detail?id=${id}` });
  const goCart = () => Taro.switchTab({ url: "/pages/cart/cart" });

  return (
    <View className="page">
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

      <View className="product-list">
        {products.map((item) => (
          <View className="product-card" key={item.id} onClick={() => goDetail(item.id)}>
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
                <View
                  className="btn-primary spec-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    goDetail(item.id);
                  }}
                >
                  选规格
                </View>
              </View>
            </View>
          </View>
        ))}

        <View className="load-tip">
          {loadingMore ? "加载中..." : !hasMore ? "— 没有更多了 —" : ""}
        </View>
      </View>

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
