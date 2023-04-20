const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 把 css 文件提取到单独的文件中
const FileManagerWebapckPlugin = require('filemanager-webpack-plugin') // 用于更改 sourcemap 文件目录

const NODE_ENV = process.env.NODE_ENV
const isProduction = NODE_ENV === 'production'

module.exports = {
  devServer: {
    host: 'localhost',
    port: 9200,
    open: true,
    // compress: true, // gzip 压缩
    hot: true, // 启动支持模块热替换
    watchFiles: [ // 监听文化变化自动重新编译
      "str/**/*js"
    ],
    historyApiFallback: true, // 处理 history 路由

  },
  entry: './src/index.ts',
  mode: NODE_ENV,
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(t|j)s$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              targets: {
                "browsers": [">0.1%"]
              }
            }
          }
        ]
      },
      {
        test: /\.ts$/,
        use: [
          "ts-loader"
        ]
      },
      {
        test: /\.(s)css$/, // 匹配的条件
        use: [ // 从后往前执行
          isProduction ?
            MiniCssExtractPlugin.loader /* 把 css-loader 处理的结果打包到 css 文件以 link 的方式插入到 head 里 */ :
            'style-loader' /* 把 css-loader 处理的结果放到 style 标签内插入到 head 里 */, 
          'css-loader', // 帮我们分析出各个 css 文件之间的关系，把各个css文件合并成一段 css,
          'postcss-loader', // 将 css 解析成 ast, 然后对 ast 处理, 最后将处理的 ast 转换成 css
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|bmp|webp|gif|svg)$/,
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              disable: !isProduction,
              moxjpeg: {
                progressive: true, // 开启渐进式 JPEG，有利于提升 JPEG 图片加载速度,
                quality: 65 // 压缩图片的质量
              },
              optipng: {
                enabled: true, // 是否开启 PNG 图片的优化, 可以有效提升 PNG 加载速度
              },
              pngquant: {
                quality: [0.65, 0.9], // 图片质量
                speed: 4 // 图片压缩速度
              },
              svgo: {
                plugins: [ // 压缩 SVG 图片的插件列表，这里包含 removeViewBox 和 cleanIDs 两个插件
                  {
                    removeViewBox: false // 用于删除 SVG 的 viewBox 属性
                  },
                  {
                    cleanupIDs: true // 删除 SVG 无用属性
                  }
                ]
              }
            }
          }
        ],
        // type: 'asset/resource' // 生成单独文件并导出 URL 地址
        type: 'asset', // 根据输出文件和 base64 之间选择
        parser: {
          dataUrlCondition: {
            maxSize: 1024
          }
        }
      },
    ]
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './index.html'
    }),
    new MiniCssExtractPlugin(),
    new FileManagerWebapckPlugin({
      events: {
        onStart: {
          delete: [path.resolve('./sourcemaps')]
        },
        onEnd: {
          copy: [
            {
              source: './dist/*.map',
              destination: path.resolve('./sourcemaps')
            }
          ],
          delete: [
            './dist/*.map'
          ]
        }
      }
    })
  ]
}