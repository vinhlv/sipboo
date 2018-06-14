var path = require('path');
var webpack = require('webpack');
var WebpackStrip = require('webpack-strip');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');

process.env.BABEL_ENV = process.env.NODE_ENV || 'development';
const ENV = process.env.NODE_ENV || 'development';
var ver = (new Date()).getTime();
var config = {
  context: path.join(__dirname),
  entry: {
    app: [
      'base/index.js',
      'assets/css/styles.css',
      'global_styles/_main.scss'
    ]
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle'+ver+'.js',
    publicPath: '/'
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: WebpackStrip.loader('console.log', 'console.error', 'debug')
    }],
    rules: [
    {
      test: /\.(js|jsx|mjs)$/,
      enforce: 'pre',
      use: [
        {
          options: {
            formatter: eslintFormatter,
            eslintPath: require.resolve('eslint')
          },
          loader: require.resolve('eslint-loader'),
        },
      ],
      include: path.resolve(__dirname, './src/'),
    },
    {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      loader: 'file-loader?name=public/fonts/[name].[ext]'
    },
    {
      test: /\.(ico|jpg|jpeg|gif|png|less)/,
      loader: 'file-loader'
    }, {
      test: /\.(js|jsx)$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react']
      }
    }, {
      test: /\.(scss|css)$/,
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: [{
          loader: "css-loader"
        }, {
          loader: "sass-loader?includePaths[]=" + path.resolve(__dirname, "./node_modules/compass-mixins/lib")
        }]
      })
    }, {
      test: /modernizr\.min\.js$/,
      loader: "imports?this=>window,html5=>window.html5!exports?window.Modernizr"
    }],
  },
  resolve: {
    extensions: [
      '*', '.scss', '.js', '.json'
    ],
    modules: [
      'node_modules',
      path.resolve(__dirname, './node_modules')
    ],
    alias: {
      'root': path.resolve(__dirname, './'),
      'base': path.resolve(__dirname, './src/'),
      'components': path.resolve(__dirname, './src/components/'),
      'assets': path.resolve(__dirname, './src/assets/'),
      'global_styles': path.resolve(__dirname, './src/assets/styles/'),
      'config': path.resolve(__dirname, './src/config'),
      'api': path.resolve(__dirname, './src/api/'),
      'app': path.resolve(__dirname, './src/components/app'),
      'node_modules': path.resolve(__dirname, './node_modules')
    }
  },
  plugins: ([
    new webpack.ProvidePlugin({
        Promise: "imports-loader?this=>global!exports-loader?global.Promise!bluebird"
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: ENV,
      options: {
        context: __dirname
      }
    }),
    new ExtractTextPlugin({
      filename: 'style.css',
      disable: false,
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      template: path.resolve('./src/', 'index.html'),
      favicon: path.resolve('./src/', 'assets/img/favicon.ico'),
      minify: {
        collapseWhitespace: true
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(ENV)
    })
    // new webpack.HotModuleReplacementPlugin()
  ]),
  devtool: ENV === 'production' ? 'source-map' : 'source-map',
  devServer: {
    port: process.env.PORT || 3000,
    contentBase: './',
    historyApiFallback: true
  }
};
module.exports = config;
