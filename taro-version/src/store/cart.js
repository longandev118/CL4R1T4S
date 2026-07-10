// 极简全局购物车（发布订阅），供各页面共享
const state = {
  cart: [] // [{ id, name, spec, price, count }]
};
const listeners = new Set();

function emit() {
  listeners.forEach((fn) => fn(state.cart));
}

export const cartStore = {
  get() {
    return state.cart;
  },
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  add(item) {
    const found = state.cart.find((i) => i.id === item.id);
    if (found) found.count += 1;
    else state.cart.push({ ...item, count: 1 });
    emit();
  },
  step(id, delta) {
    const item = state.cart.find((i) => i.id === id);
    if (!item) return;
    item.count += delta;
    if (item.count <= 0) state.cart = state.cart.filter((i) => i.id !== id);
    emit();
  },
  clear() {
    state.cart = [];
    emit();
  },
  total() {
    return state.cart.reduce((sum, i) => sum + i.price * i.count, 0);
  },
  count() {
    return state.cart.reduce((n, i) => n + i.count, 0);
  }
};
