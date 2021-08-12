const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

// const { removeSync, outputJson } = require('fs-extra');

// const kebabCase = require('kebab-case');
// const hexRgb = require('hex-rgb');

// const buildInfo = require('preval-build-info');

// const rawStyleConfig = require('./src/theme/default/legacy');

const isDevBuild = process.env.NODE_ENV === 'development';

const stylesHandler = MiniCssExtractPlugin.loader;

// const styleConfig = Object.keys(rawStyleConfig).map(key => {
//   const isHex = /^#[0-9A-F]{6}$/i.test(rawStyleConfig[key]);
//   return {
//     [`$raw_${kebabCase(key)}`]: isHex
//       ? hexRgb(rawStyleConfig[key], { format: 'array' }).splice(0, 3).join(',')
//       : rawStyleConfig[key],
//   };
// });

// function exportBuildInfo() {
//   const buildInfoData = {
//     timestamp: buildInfo.timestamp,
//     gitHashShort: buildInfo.gitHashShort,
//     gitBranch: buildInfo.gitBranch,
//   };
//   return outputJson('build/buildInfo.json', buildInfoData);
// }

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
        exclude: ['/node_modules/'],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
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
        test: /\.node$/,
        loader: 'node-loader',
      },
    ],
  },
  mode: isDevBuild ? 'development' : 'production',
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        // mvSrc
        { from: 'src' },
        // mvPackageJson
        { from: 'package.json' },
        // mvLernaPackages
        { from: 'packages/**', to: 'packages' },
        // html
        { from: 'src/**/*.html' },
        // scripts
        { from: 'src/**/*.js' },
        // styles
        { from: 'src/styles/main.scss', to: 'styles' },
        // verticalStyle
        { from: 'src/styles/vertical.scss', to: 'styles' },
        // recipes
        { from: 'recipes/archives/*.tar.gz', to: 'recipes' },
        // recipeInfo
        { from: 'recipes/*.json', to: 'recipes' },
      ],
    }),
  ],
  devServer: {
    host: 'localhost',
    hot: true,
  },
  devtool: isDevBuild ? 'inline-source-map' : 'source-map',
  optimization: {
    minimize: false,
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
