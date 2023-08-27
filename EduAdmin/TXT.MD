#EduAdmin

## 打包优化方案 配置代码分割
1.安装 Webpack：进入你的项目根目录，在终端中运行以下命令安装 Webpack 及其相关的依赖：
`npm install webpack webpack-cli --save-dev`
2.创建 Webpack 配置文件：在项目根目录下创建一个名为 webpack.config.js 的文件，并进行相应的配置:
```
module.exports = {
  entry: './src/index.js', // 入口文件路径
  output: {
    filename: 'bundle.js', // 输出文件名
    path: path.resolve(__dirname, 'dist'), // 输出目录路径
  },
  module: {
    rules: [
      // 添加针对.js和.jsx文件的处理规则
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader', // 使用 babel-loader 进行转译
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all', // 代码分割的范围，可选值为 'all', 'async', 'initial'
    },
  },
};
```
3.安装并配置 Babel:由于 React 项目通常使用 JSX 语法和一些新的 JavaScript 特性，你需要使用 Babel 来将其转换为浏览器可识别的代码。运行以下命令安装相关的依赖：
`npm install @babel/core @babel/preset-react babel-loader --save-dev`
在项目根目录下创建名为 .babelrc 的文件，并配置 Babel 的预设：
```
{
  "presets": ["@babel/preset-react"]
}
```
4.修改 package.json 文件中的 "scripts" 部分，如下所示：
先安装
`npm install webpack webpack-cli webpack-dev-server --save-dev`
然后在 package.json 文件中的 "scripts" 部分
```
"scripts": {
  "start": "webpack-dev-server --open",
  "build": "webpack --mode production --config webpack.config.js"
}
```
