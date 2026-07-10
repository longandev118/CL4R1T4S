import { Component } from "react";
import "./app.scss";

// 根组件：Taro 里 app.js 承载全局逻辑
class App extends Component {
  render() {
    // this.props.children 是当前页面
    return this.props.children;
  }
}

export default App;
