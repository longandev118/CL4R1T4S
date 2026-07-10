import { useEffect, useState } from "react";
import Taro, { useRouter, useDidShow } from "@tarojs/taro";
import { View, Text, Swiper, SwiperItem } from "@tarojs/components";
import { getGoodsDetail } from "../../api/goods";
import { cartStore } from "../../store/cart";
import "./detail.scss";

export default function Detail() {
  const router = useRouter();
  const id = Number(router.params.id);

  const [detail, setDetail] = useState(null);
  const [showSpec, setShowSpec] = useState(false);
  const [specAction, setSpecAction] = useState("cart");
  const [activeSpecId, setActiveSpecId] = useState(null);
  const [count, setCount] = useState(1);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    getGoodsDetail(id).then((d) => {
      setDetail(d);
      if (d) setActiveSpecId(d.specs[0].id);
    });
  }, [id]);

  const refreshCart = () => setCartCount(cartStore.count());
  useDidShow(refreshCart);

  const openSpec = (action) => {
    setSpecAction(action);
    setCount(1);
    setShowSpec(true);
  };

  const confirm = () => {
    const spec = detail.specs.find((s) => s.id === activeSpecId);
    for (let i = 0; i < count; i++) {
      cartStore.add({ id: spec.id, name: detail.name, spec: spec.label, price: spec.price });
    }
    setShowSpec(false);
    refreshCart();
    if (specAction === "buy") Taro.switchTab({ url: "/pages/cart/cart" });
    else Taro.showToast({ title: "已加入购物车", icon: "success" });
  };

  const goCart = () => Taro.switchTab({ url: "/pages/cart/cart" });

  if (!detail) return <View className="detail" />;

  return (
    <View className="detail">
      <Swiper className="banner" indicatorDots autoplay circular>
        {detail.banner.map((b, i) => (
          <SwiperItem key={i}>
            <View className="banner-img">{b}</View>
          </SwiperItem>
        ))}
      </Swiper>

      <View className="head">
        <View className="price-row">
          <Text className="price">
            <Text className="rmb">¥</Text>
            {detail.specs[0].price}
          </Text>
          <Text className="from">起</Text>
        </View>
        <View className="title">{detail.name}</View>
        <View className="sub">{detail.desc}</View>
      </View>

      <View className="row" onClick={() => openSpec("cart")}>
        <Text>选择规格</Text>
        <Text className="arrow">共 {detail.specs.length} 种规格 ›</Text>
      </View>

      <View className="section-title">商品详情</View>
      {detail.detailImages.map((img, i) => (
        <View className="detail-img" key={i}>
          {img}
        </View>
      ))}

      <View className="action-bar">
        <View className="act-icon" onClick={goCart}>
          🛒
          {cartCount > 0 && <Text className="badge">{cartCount}</Text>}
        </View>
        <View className="act-btn add" onClick={() => openSpec("cart")}>
          加入购物车
        </View>
        <View className="act-btn buy" onClick={() => openSpec("buy")}>
          立即购买
        </View>
      </View>

      {showSpec && <View className="mask" onClick={() => setShowSpec(false)} />}
      <View className={`spec-popup ${showSpec ? "show" : ""}`}>
        <View className="spec-head">
          <Text className="spec-title">选择规格</Text>
          <Text className="spec-close" onClick={() => setShowSpec(false)}>
            ×
          </Text>
        </View>
        <View className="spec-list">
          {detail.specs.map((s) => (
            <View
              key={s.id}
              className={`spec-item ${activeSpecId === s.id ? "active" : ""}`}
              onClick={() => setActiveSpecId(s.id)}
            >
              {s.label} · ¥{s.price}
            </View>
          ))}
        </View>
        <View className="qty-row">
          <Text>数量</Text>
          <View className="stepper">
            <View className="step-btn" onClick={() => setCount(Math.max(1, count - 1))}>
              -
            </View>
            <Text className="step-num">{count}</Text>
            <View className="step-btn" onClick={() => setCount(count + 1)}>
              +
            </View>
          </View>
        </View>
        <View className="btn-primary confirm-btn" onClick={confirm}>
          {specAction === "buy" ? "立即购买" : "确定"}
        </View>
      </View>
    </View>
  );
}
