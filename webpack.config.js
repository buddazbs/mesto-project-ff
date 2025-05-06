const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: {
    main: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '',
  },
  mode: 'development',
  devServer: {
    static: path.resolve(__dirname, './dist'),
    open: true,
    compress: true,
    port: 8080
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      "@components": path.resolve(__dirname, 'src/components/'),
      "@utilities": path.resolve(__dirname, 'src/utilities/'),
      "@api": path.resolve(__dirname, 'src/services/api/'),
      "@elements": path.resolve(__dirname, 'src/elements/'),
      "@images": path.resolve(__dirname, 'src/images/'),
      "@vendor": path.resolve(__dirname, 'src/vendor/'),
      "@pages": path.resolve(__dirname, 'src/pages/'),
    },
  },
  module: {
    rules: [{
        test: /\.js$/,
        use: 'babel-loader',
        exclude: '/node_modules/'
      },
      {
        test: /\.(png|svg|jpg|gif|woff|woff(2)?|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]',
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new CleanWebpackPlugin(),
    new Dotenv(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
}