const Dotenv = require("dotenv-webpack");
const baseConfig = require("./webpack.config.base");
const config = {
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins,
    new Dotenv(
      { path: ".env.development" } // 环境变量文件路径}
    ), // 使用Dotenv插件加载.env文件
  ],
};

module.exports = config;