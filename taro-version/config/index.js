const config = {
  projectName: "taro-pagoda-demo",
  date: "2026-7-10",
  designWidth: 750,
  deviceRatio: { 750: 1 / 2 },
  sourceRoot: "src",
  outputRoot: "dist",
  plugins: [],
  framework: "react",
  compiler: "webpack5",
  mini: {
    postcss: {
      pxtransform: { enable: true, config: {} }
    }
  },
  h5: {
    publicPath: "/",
    staticDirectory: "static"
  }
};

module.exports = function (merge) {
  return merge({}, config);
};
