const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const ExtractTextPlugin = require("extract-text-webpack-plugin"); // CSS提取插件
// 代码结构可视化工具
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    context: __dirname + '/src',
    entry: {
      "bidacard/js/bundle": './bidacard/scripts/root.js',
      "flight/js/bundle": './flight/scripts/root.js',
      "lib/react": ['react','react-dom','react-router'],
      "lib/redux": ['redux','redux-immutablejs','redux-thunk']
    },
    module: {
        loaders: [
          {
            test: /\.js[x]?$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
          },
          {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                {
                  loader: "css-loader",
                  options: {
                      minimize: true //css压缩
                  }
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    plugins: () => [
                      autoprefixer({
                        browsers: [
                          "> 1%",
                          "last 2 versions",
                          "Android >= 3.2",
                          "Firefox >= 20",
                          "iOS 7"
                        ]
                      }),
                      pxtorem({
                        rootValue: 100,
                        // 忽略border相关属性
                        propList: ["*", "!border*"]
                      })
                    ]
                  }
                }
              ]
            })
          },
          // svg-sprite for antd-mobile@1.0
          {
            test: /\.(svg)$/i,
            loader: 'svg-sprite-loader',
            include: [require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // 1. 属于 antd-mobile 内置 svg 文件
            // path.resolve(__dirname, 'src/my-project-svg-foler'),  // 自己私人的 svg 存放目录
            ],
          },
          {
            test: /\.less$/,
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                {
                  loader: "css-loader",
                  options: {
                    minimize: true //css压缩
                  }
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    plugins: () => [
                      autoprefixer({
                        browsers: [
                          "> 1%",
                          "last 2 versions",
                          "Android >= 3.2",
                          "Firefox >= 20",
                          "iOS 7"
                        ]
                      }),
                      pxtorem({
                        rootValue: 100,
                        // 忽略border相关属性
                        propList: ["*", "!border*"]
                      })
                    ]
                  }
                },
                {
                  loader: 'less-loader'
                }
              ]
            })
          },
          {
            test: /\.(jpg|png)$/,
            loader: "url-loader"
          },
          {
            test: /\.html$/,
            loader: 'html-loader'
          }
        ]
    },
    resolve: {
      modules: ['node_modules', path.join(__dirname, '../node_modules')],
      extensions: ['.web.js', '.jsx', '.js', '.json'],
    },
    plugins: [
      // new BundleAnalyzerPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
      }),
      new webpack.optimize.UglifyJsPlugin({    //压缩代码
        output: {
          comments: false  // remove all comments(去掉所有注释)
        },
        compress: {
          warnings: false,
          drop_debugger: true,
          drop_console: true
        },
        mangle: {
          except: ['$super', '$', 'exports', 'require', 'module', '_'] // 排除关键字
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({ // 提取公共代码
        name: ['lib/react','lib/redux'],
        minChunks: Infinity
      }),
      // 每个文件检测如果没有引入下列模块则自动require,路径就是每个文件的路径
      new webpack.ProvidePlugin({
        React: "react",
        PropTypes: "prop-types",
        Tool: ["../../tools/tool", "Tool"],
        Header: ["../common/header", "default"],
        is: ["immutable", "is"],
        fromJS: ["immutable", "fromJS"],
        _data: ["../data/document", "default"] // 所有项目中可变的文案
      })
    ]
};
