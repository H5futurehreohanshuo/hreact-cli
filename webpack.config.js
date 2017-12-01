const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.config.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // HTML生成插件
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // CSS提取插件
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');

const PATHS = {
  // output: path.join(__dirname, 'dist', 'static', 'fe'),
  output: path.join(__dirname, '../../../target/classes/static/fe/'),
  htmlOutput: '../../templates/fe/',
  publicPath_LOCAL: '/fe/',
  publicPath_CDN: 'https://oe7f0jikj.qnssl.com/biqu/web/fe/',
};

module.exports = [
  merge(common, {
    output: {
      path: PATHS.output,
      publicPath: PATHS.publicPath_LOCAL,
      filename: '[name].js',
    },
    plugins: [
      new HtmlWebpackPlugin({ // 根据模板插入css/js等生成最终HTML
        title: '必去',
        favicon: './common/images/biqu.ico', // favicon路径，通过webpack引入同时可以生成hash值
        filename: `${PATHS.htmlOutput}flight/index.html`, // 生成的html存放路径，相对于path
        template: './flight/templates/index.html', // html模板路径
        inject: 'body', // js插入的位置，true/'head'/'body'/false
        hash: true, // 为静态资源生成hash值
        chunks: ['lib/redux', 'lib/react', 'flight/js/bundle'], // 需要引入的chunk，不配置就会引入所有页面的资源
        minify: { // 压缩HTML文件
          removeComments: false, // 移除HTML中的注释
          collapseWhitespace: false, // 删除空白符与换行符
        },
      }),
      new HtmlWebpackPlugin({ // 根据模板插入css/js等生成最终HTML
        title: '必达卡',
        favicon: './common/images/biqu.ico', // favicon路径，通过webpack引入同时可以生成hash值
        filename: `${PATHS.htmlOutput}bidacard/index.html`, // 生成的html存放路径，相对于path
        template: './bidacard/templates/index.html', // html模板路径
        inject: 'body', // js插入的位置，true/'head'/'body'/false
        hash: true, // 为静态资源生成hash值
        chunks: ['lib/redux', 'lib/react', 'bidacard/js/bundle'], // 需要引入的chunk，不配置就会引入所有页面的资源
        minify: { // 压缩HTML文件
          removeComments: false, // 移除HTML中的注释
          collapseWhitespace: false, // 删除空白符与换行符
        },
      }),
      new ExtractTextPlugin({
        filename: (getPath) => {
          return getPath('[name].css').replace('/js/', '/css/');
        },
        disable: false, // 禁用插件
        allChunks: true, // 向所有额外的 chunk 提取（默认只提取初始加载模块）
      }),
      new CleanWebpackPlugin(
        ['dist'], // 匹配删除的文件
        {
          root: __dirname, // 根目录
          verbose: false, // 开启在控制台输出信息
          dry: false, // 启用删除文件
        }
      ),
      new CopyWebpackPlugin([
        {
          from: './bidacard/templates/wxpay.html',
          to: path.join(PATHS.htmlOutput, 'bidacard', 'wxpay.html'),
        },
        {
          from: './flight/templates/wxpay.html',
          to: path.join(PATHS.htmlOutput, 'flight', 'wxpay.html'),
        },
      ]),
    ],
  }),
  merge(common, {
    output: {
      path: PATHS.output,
      publicPath: PATHS.publicPath_CDN,
      filename: '[name].[chunkhash:8].js',
    },
    plugins: [
      new WebpackMd5Hash(),
      new HtmlWebpackPlugin({ // 根据模板插入css/js等生成最终HTML
        title: '必去',
        favicon: './common/images/biqu.ico', // favicon路径，通过webpack引入同时可以生成hash值
        filename: `${PATHS.htmlOutput}flight/index_cdn.html`, // 生成的html存放路径，相对于path
        template: './flight/templates/index.html', // html模板路径
        inject: 'body', // js插入的位置，true/'head'/'body'/false
        hash: true, // 为静态资源生成hash值
        chunks: ['lib/redux', 'lib/react', 'flight/js/bundle'], // 需要引入的chunk，不配置就会引入所有页面的资源
        minify: { // 压缩HTML文件
          removeComments: true, // 移除HTML中的注释
          collapseWhitespace: false, // 删除空白符与换行符
        },
      }),
      new HtmlWebpackPlugin({ // 根据模板插入css/js等生成最终HTML
        title: '必达卡',
        favicon: './common/images/biqu.ico', // favicon路径，通过webpack引入同时可以生成hash值
        filename: `${PATHS.htmlOutput}bidacard/index_cdn.html`, // 生成的html存放路径，相对于path
        template: './bidacard/templates/index.html', // html模板路径
        inject: 'body', // js插入的位置，true/'head'/'body'/false
        hash: true, // 为静态资源生成hash值
        chunks: ['lib/redux', 'lib/react', 'bidacard/js/bundle'], // 需要引入的chunk，不配置就会引入所有页面的资源
        minify: { // 压缩HTML文件
          removeComments: true, // 移除HTML中的注释
          collapseWhitespace: false, // 删除空白符与换行符
        },
      }),
      new ExtractTextPlugin({
        filename: (getPath) => {
          return getPath('[name].[contenthash:8].css').replace('/js/', '/css/');
        },
        disable: false, // 禁用插件
        allChunks: true, // 向所有额外的 chunk 提取（默认只提取初始加载模块）
      }),
    ],
  }),
];
