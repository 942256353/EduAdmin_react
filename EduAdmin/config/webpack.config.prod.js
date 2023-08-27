const Dotenv = require("dotenv-webpack");
const baseConfig = require("./webpack.config.base");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const config = {
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins,
    new Dotenv(
      { path: ".env.production" } // 环境变量文件路径}
    ), // 使用Dotenv插件加载.env文件
  ],
  optimization: {
    ...baseConfig.optimization,
    minimize: true,
    usedExports: true,
    minimizer: [new OptimizeCSSAssetsPlugin({})],
    splitChunks: {
      cacheGroups: {
        ...baseConfig.optimization.splitChunks.cacheGroups,
        // 将所有的样式文件打包到单个项目
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    },
    minimizer: [
      new TerserPlugin({
        // 省略其他选项...
        terserOptions: {
          compress: {
            // 配置压缩选项
            // 例如, 去除console语句
            drop_console: true,
            unused:true,//设置为true时，将删除未使用的变量和函数
          },
          mangle:{
            //配置混淆选项
          },
          // 更多 terser 选项...
          output:{
            comments:false,//设置为false时，将删除所有注释。
            beautify:false,//设置为false时，压缩代码,将输出最小化的
          }
        },
      }),
    ],
  }
};
delete config.extra;
module.exports = config;
