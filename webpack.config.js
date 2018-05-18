const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
//js代码压缩
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
//
const HtmlWebpackPlugin = require('html-webpack-plugin');
//css分离
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

// 剔除文件总没有用到的css
const PurifyCSSWebpackPlugin = require('purifycss-webpack');

//拷贝静态资源
const CopyWebpackPlugin = require('copy-webpack-plugin');

//清理dist目录
const CleanWebpackPlugin = require('clean-webpack-plugin');

// 鉴别是开发模式还是生产模式
console.log(process.env.type);
let website;
if (process.env.type == 'build') {
  website = {
    publicPath: 'http://192.168.88.118:34177/', //要npm start 再npm run server
  }
} else if (process.env.type == 'dev') {
  website = {
    publicPath: 'http://192.168.88.118:34177/', //要npm start 再npm run server
  }
}


module.exports = {
  devtool: 'source-map',
  entry: {
    app: './src/app.js',
    jquery: 'jquery'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: website.publicPath
  },
  module: {
    rules: [{
        test: /\.scss/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: "style-loader",
          use: [{
              loader: "css-loader"
            },
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  path: 'postcss.config.js'
                }
              }
            },
            {
              loader: 'sass-loader'
            }
          ]
        })
      },
      {
        test: /\.(png|jpeg|jpg|gif|svg)$/,
        loader: {
          loader: 'url-loader', //file-loader解决的是打包后的图片路径问题，url-loader内嵌了file-loader,url-loader作用是limit
          options: {
            limit: 5000,
            outputPath: 'images/' //修改了打包输出后的图片路径
          }
        }
      },
      {
        test: /\.(htm|html)$/i, //修正了国人喜欢在HTML中写图片，从而产生的路径问题,以及不打包到dist/image中
        use: {
          loader: 'html-withimg-loader'
        }
      },
      {
        test: /\.(jsx|js)$/,
        use: {
          loader: 'babel-loader'
          //为什么不写在这里，而是创建了一个.babelrc文件，
          // 因为以后的preset会越写越多
          // options:{
          // preset:['env','react']
          // }
        },
        exclude: '/node_modules/' //忽略nodejs包
      }

    ]
  },
  plugins: [
    new CleanWebpackPlugin(['./dist']),
    new UglifyjsWebpackPlugin(), //js代码压缩
    new HtmlWebpackPlugin({
      minify: {
        removeAttributeQuotes: true, //去掉引号
      },
      hash: true,
      template: './src/index.html'
    }),
    new ExtractTextWebpackPlugin({
      filename: 'css/[name].css' //输出到dist的目录的路径
    }),
    new PurifyCSSWebpackPlugin({
      paths: glob.sync(path.join(__dirname, 'src/**/*.html'))
    }),
    new webpack.ProvidePlugin({ //配置第三方依赖，如果不使用的话，不会打包到js中
      $: 'jquery'
    }),
    new webpack.BannerPlugin('snakeyu 版权所有，转发请注明出处！谢谢'), //在js的顶部添加一行注释
    new webpack.optimize.CommonsChunkPlugin({ //把公共的js抽离
      name: ['jquery'], //对应entry内的jQuery,单独抽离，
      filename: 'assets/js/[name].js', //抽离到的路径,
      minChunks: 2 //最少抽离几个文件
    }),
    new CopyWebpackPlugin([{ //要拷贝静态资源
      from: __dirname + "/src/assets",
      to: './assets' //这里是相对于output路径输出
    }]),
    new webpack.HotModuleReplacementPlugin() //热更新插件
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    host: '192.168.88.118',
    compress: true,
    port: 34177
  },
  watchOptions: {
    poll: 1000, //检测修改的时间
    aggregateTimeout: 500, //防止保存，不触发打包
    ignored: /node_modules/ //不需要检测的文件或文件夹
  }
}