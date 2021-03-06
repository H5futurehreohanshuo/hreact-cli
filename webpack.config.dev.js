const path = require('path');
const webpack = require('webpack');
// css、less的共有loader
const commonCssUse = [
  {
    loader: 'style-loader',
  }, {
    loader: 'css-loader',
    options: {
      modules: true,
      localIdentName: '[path][name]__[local]--[hash:base64:5]',
    },
  }, {
    loader: 'postcss-loader',
  },
];

module.exports = {
  context: path.join(__dirname, '/src'),
  entry: {
    youwen: './entries/youwen.js',
  },
  module: {
    loaders: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [...commonCssUse],
      },
      {
        test: /\.less$/,
        use: [
          ...commonCssUse,
          {
            loader: 'less-loader',
          },
        ],
      },
      // svg-sprite for antd-mobile@1.0
      {
        test: /\.(svg)$/i,
        loader: 'svg-sprite-loader',
        include: [require.resolve('antd-mobile').replace(/warn\.js$/, ''), // 1. 属于 antd-mobile 内置 svg 文件
        // path.resolve(__dirname, 'src/my-project-svg-foler'),  // 自己私人的 svg 存放目录
        ],
      },
      {
        test: /\.(jpg|png)$/,
        loader: 'url-loader',
      },
    ],
  },
  output: {
    path: path.join(__dirname, '/src/'),
    filename: '[name].js',
  },
  resolve: {
    modules: ['node_modules', path.join(__dirname, '../node_modules')],
    extensions: ['.web.js', '.jsx', '.js', '.json'],
  },
  devServer: {
    quiet: false, // 热更新不打印日志
    historyApiFallback: { // 支持H5的history属性
      rewrites: [
        { from: /^\/youwen/, to: 'src/pages/youwen.html' }, // 囿文
      ],
    },
    proxy: {
      '/localhost': {
        // target: "http://localhost:8950/",
        target: 'http://dev.panatrip.cn:18950/',
        pathRewrite: {
          '^/localhost': '',
        },
      },
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // 每个文件检测如果没有引入下列模块则自动require,路径就是每个文件的路径
    new webpack.ProvidePlugin({
      React: 'react',
      PropTypes: 'prop-types',
      // Tool: ['../../tools/tool', 'Tool'],
      // Header: ['../common/header', 'default'],
      is: ['immutable', 'is'],
      fromJS: ['immutable', 'fromJS'],
      // _data: ['../data/document', 'default'] // 所有项目中可变的文案
    }),
  ],
};
