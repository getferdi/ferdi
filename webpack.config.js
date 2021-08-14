const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDevBuild = process.env.NODE_ENV === 'development';

const stylesHandler = MiniCssExtractPlugin.loader;

module.exports = {
  target: 'electron-main',
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [stylesHandler, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.node$/,
        loader: 'node-loader',
      },
    ],
  },
  mode: isDevBuild ? 'development' : 'production',
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        isDevBuild ? 'development' : 'production',
      ),
      // 'process.env.DEBUG': JSON.stringify(process.env.DEBUG),
    }),
    // new HtmlWebpackPlugin({
    //   template: path.resolve(__dirname, './src/index.html'),
    //   filename: 'index.html',
    // }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new CopyPlugin({
      patterns: [
        // mvSrc
        { from: 'src' },
        // mvPackageJson
        { from: 'package.json' },
        // mvLernaPackages
        { from: 'packages/**' },
        // html
        { from: 'src/**/*.html' },
        // scripts
        { from: 'src/**/*.js' },
        // styles
        { from: 'src/styles/main.scss', to: 'styles' },
        // verticalStyle
        { from: 'src/styles/vertical.scss', to: 'styles' },
        // recipes
        { from: 'recipes/archives/*.tar.gz' },
        // recipeInfo
        { from: 'recipes/*.json' },
      ],
    }),
  ],
  devServer: {
    host: 'localhost',
    hot: true,
  },
  devtool: isDevBuild ? 'inline-source-map' : false,
  cache: {
    type: 'filesystem',
  },
  optimization: {
    minimize: false,
    // TODO: make minification work, issue with decorators
    // minimize: !isDevBuild,
  },
  stats: { errorDetails: true },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.node'],
    fallback: {
      assert: false,
      buffer: false,
      child_process: false,
      console: false,
      constants: false,
      crypto: false,
      domain: false,
      events: false,
      http: false,
      https: false,
      net: false,
      os: false,
      punycode: false,
      process: false,
      querystring: false,
      stream: false,
      string_decoder: false,
      sys: false,
      timers: false,
      tty: false,
      url: false,
      util: false,
      vm: false,
      x11: false,
      zlib: false,
    },
  },
};
