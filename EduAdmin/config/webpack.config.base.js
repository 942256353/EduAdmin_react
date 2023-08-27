const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const PATHS = {
  src: path.join(__dirname, "../src"),
  dist: path.join(__dirname, "../dist"),
};
const ASSETS_PUBLIC_PATH = "/";
const moduleCSSLoader = {
  loader: "css-loader", // CSS 加载器
  options: {
    modules: true, // 启用 CSS 模块化
    sourceMap: true, // 生成 CSS 的 source map 文件
    importLoaders: 2, // 在当前 loader 之前使用 2 个 loader 进行处理
    localIdentName: "[path][name][local][hash:base64:5]", // 生成的 CSS 类名格式
  },
};

module.exports = {
  // 自动解析确定的扩展
  resolve: {
    extensions: [".js", ".jsx", ".css", ".less", ".scss"],
  },
  // 入口 babel-polyfill这是一个用于提供 ES6+ 兼容性的 polyfill，它可以让你在旧版浏览器中使用最新的 JavaScript 特性和语法
  entry: {
    index: ["babel-polyfill", path.join(PATHS.src, "index.js")],
  },
  output: {
    // 输出文件的目录路径
    path: PATHS.dist,

    // 打包生成的文件在浏览器中请求的公共路径
    publicPath: ASSETS_PUBLIC_PATH,

    // 打包生成的主要文件的文件名
    filename: "[name].[chunkhash].js", // 使用 [chunkhash] 添加指纹密码

    // 生成的源代码映射文件的文件名
    sourceMapFilename: "[name].bundle.map",

    // 非入口（非主要）代码块的文件名
    chunkFilename: "[name].[chunkhash].js",

    // 在浏览器环境中运行时的全局对象
    //globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            //babel-loader 配置项
            babelrc: true, // 使用 .babelrc 文件中的配置
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              name: "images/[name].[ext]",
            },
          },
        ],
        exclude: /node_modules/,
      },
      //   {
      //     test: /favicon\.ico$/,
      //     loader: "file-loader",
      //     options: {
      //       name: "[name].[ext]",
      //       outputPath: "",
      //       publicPath: "./",
      //     },
      //   }
    ],
  },
  optimization: {
    // 运行时分块，将 runtime 代码提取到一个共享块中，会改善页面性能
    runtimeChunk: "single",
    //用于将代码拆分成多个模块的配置
    splitChunks: {
      //定义了一组缓存组，每个缓存组可以独立地配置拆分规则
      cacheGroups: {
        //存组的名称，用于指定要提取的模
        vendor: {
          // 匹配要提取的模块的条件，这里使用正则表达式匹配位于 node_modules 目录下的模块
          test: /[\\/]node_modules[\\/]/,

          // 提取后的模块的名称
          name: "vendor",

          // 决定提取哪些代码块，"all" 表示提取所有的代码块
          chunks: "all",

          // 模块的优先级，当同一个模块满足多个缓存组的条件时，根据优先级决定归属哪个组，值越大优先级越高
          priority: 10,

          // 强制进行拆分，即使拆分后的模块体积比较小
          enforce: true,
        },
        common: {
          // 提取后的模块的名称
          name: "common",

          // 决定提取哪些代码块，"all" 表示提取所有的代码块
          chunks: "all",

          // 模块至少被引用的次数达到 minChunks 次才会被提取
          minChunks: 2,

          // 模块的优先级，当同一个模块满足多个缓存组的条件时，根据优先级决定归属哪个组，值越大优先级越高
          priority: 5,

          // 当一个模块已经被拆分出来，再次引用时是否复用已有的拆分后的模块
          reuseExistingChunk: true,
        },
      },
    },
  },
  // optimization: {
  //     runtimeChunk: "single", // 将 runtime 代码提取到一个共享块中，改善页面性能
  //     splitChunks: {
  //       cacheGroups: {
  //         vendor: {
  //           test: /[\\/]node_modules[\\/]/,
  //           name: "vendor",
  //           chunks: "all",
  //           enforce: true,
  //         },
  //         common: {
  //           name: "common",
  //           chunks: "all",
  //           minChunks: 2,
  //           priority: 5,
  //           reuseExistingChunk: true,
  //         },
  //       },
  //     },
  //   },
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html", // HTML模板文件的路径，指定为public/index.html
      filename: "index.html", // 生成的HTML文件的文件名为index.html
      minify: {
        collapseWhitespace: true, // 压缩HTML文件中的空格
        removeComments: true, // 删除HTML文件中的注释
        removeAttributeQuotes: true, // 删除HTML文件中标签内属性值周围的引号
      },
    }),
    new CleanWebpackPlugin(), //用于在每次构建之前清理输出目录
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public/favicon.ico",
          to: "",
        },
        {
          from: "public/web.config", // 不打包直接输出的文件
          to: "", // 打包后静态文件放置位置
        },
      ],
    }),
  ],
  resolve: {
    //定义需要解析的文件扩展名
    extensions: [".js", ".jsx", ".json"],
    //定义模块的别名
    alias: {
      assets: path.resolve(__dirname, "../src/assets"),
      views: path.resolve(__dirname, "../src/views"),
      utils: path.resolve(__dirname, "../src/utils"),
      routers: path.resolve(__dirname, "../src/routers"),
    },
  },
  extra: {
    moduleCSSLoader,
    PATHS,
  },
};
