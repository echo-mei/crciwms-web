const path = require("path");
const webpack = require("webpack");
require("babel-polyfill");
const resolve = dir => {
  return path.join(__dirname, dir);
};

// 项目部署基础

const BASE_URL = process.env.NODE_ENV === "production" ? "/" : "/";

module.exports = {
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  baseUrl: BASE_URL,
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        jQuery: "jquery",
        $: "jquery",
      })
    ]
  },
  // 关键配置：node_modules里面需要用babel-loader进行编译的包
  // （node_modules的包如果没做 es6 => es5 转码则需要自己用babel-polyfill进行手动处理）
  // 如果IE下还跑不起来，控制台发现有其他es6语法的，尝试调试去找到底是哪个包
  transpileDependencies: ['iview', 'axios'],
  chainWebpack: config => {
    config.entry('polyfill').add('@babel/polyfill');
    // config.output.filename('[name].[hash].js').end();

    config.resolve.alias
      .set("@", resolve("src")) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set("_c", resolve("src/components"));
  },
  css: {
    extract: false
  },
  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  devServer: {
    open: false,
    https: false, // https:{type:Boolean}
    disableHostCheck: true,
    hotOnly: true,
    proxy: {
      "/": {
        ws: false, // proxy websockets
        // target: "http://192.168.0.102:8002", //凌宏永本地
        target: 'http://192.168.0.112:8002', //冷浩浩本地
        // target: 'http://192.168.1.180:8081 ', //服务器
        changeOrigin: true,
        pathRewrite: {
          "^/": "/" //服务器
        }
      }
    }
  }
};
