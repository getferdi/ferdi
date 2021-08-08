const path = require('path');
const webpack = require('webpack');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      // {
      //   test: /\.(css|scss)$/,
      //   use: [
      //     'style-loader', // creates style nodes from JS strings
      //     'css-loader', // translates CSS into CommonJS
      //     'sass-loader', // compiles Sass to CSS, using Node Sass by default
      //   ],
      // },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: isDev ? 'development' : 'production',
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],

  resolve: {
    fallback: {
      assert: false,
      buffer: false,
      child_process: false,
      console: false,
      constants: false,
      crypto: false,
      domain: false,
      events: false,
      fs: false,
      http: false,
      https: false,
      net: false,
      os: false,
      path: false,
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
