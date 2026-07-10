import { useState } from "react";
import Taro, { useDidShow } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { cartStore } from "../../store/cart";
import { createOrder } from "../../api/goods";
import "./cart.scss";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState("0.00");

  const refresh = () => {
    setCart([...cartStore.get()]);
    setTotal(cartStore.total().toFixed(2));
  };

  useDidShow(refresh);

  const step = (id, delta) => {
    cartStore.step(id, delta);
    refresh();
  };

  const checkout = async () => {
    if (cartStore.get().length === 0) {
      Taro.showToast({ title: "购物车是空的", icon: "none" });
      return;
    }
    const { orderId } = await createOrder(cartStore.get());
    // 真实项目：后端返回支付参数后 Taro.requestPayment 拉起微信支付
    Taro.showToast({ title: `下单成功 ${orderId}`, icon: "success" });
    cartStore.clear();
    refresh();
  };

  return (
    <View className="cart-page">
      {cart.length === 0 ? (
        <View className="empty">购物车还是空的~</View>
      ) : (
        cart.map((item) => (
          <View className="cart-item" key={item.id}>
            <View className="c-img">图</View>
            <View className="c-info">
              <View className="c-name">{item.name}</View>
              <View className="c-spec">{item.spec}</View>
              <View className="c-bottom">
                <Text className="price">¥{item.price}</Text>
                <View className="stepper">
                  <View className="step-btn" onClick={() => step(item.id, -1)}>
                    -
                  </View>
                  <Text className="step-num">{item.count}</Text>
                  <View className="step-btn" onClick={() => step(item.id, 1)}>
                    +
                  </View>
                </View>
              </View>
            </View>
          </View>
        ))
      )}

      <View className="cart-bar">
        <View className="cart-total">
          合计 <Text className="price">¥{total}</Text>
        </View>
        <View className="btn-primary checkout-btn" onClick={checkout}>
          去结算
        </View>
      </View>
    </View>
  );
}
