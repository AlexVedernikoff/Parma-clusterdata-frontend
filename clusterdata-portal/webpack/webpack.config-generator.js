const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const { PORTAL_ASSETS_PATH } = require('../src/context-path');
const CompressionPlugin = require('compression-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

exports.generateConfig = ({ biHost, portalHost, exportHost }, mode, devServer, devtool, env) => {
  return {
    mode,
    entry: {
      navigation: './src/entries/navigation.js',
      dataset: './src/entries/dataset.js',
      connection: './src/entries/connection.js',
      app: './src/entries/app.js',
      dash: './src/entries/dash.js',
    },
    output: {
      path: path.resolve('./dist/'),
      filename: 'js/[name].js',
      publicPath: PORTAL_ASSETS_PATH,
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendors: {
            test: /node_modules/,
            name: 'vendors',
            chunks: 'all',
          },
          commons: {
            test: /parma_modules/,
            name: 'commons',
            chunks: 'all',
          },
        },
      },
    },
    stats: 'normal',
    devServer,
    devtool,
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json', '.mjs'],
      preferRelative: false,
      alias: {
        '@parma-ui': path.resolve('./parma_modules/parma-ui'),
        '@parma-data-ui': path.resolve('./parma_modules/@parma-data-ui/'),
        '@parma-lego': path.resolve('./parma_modules/@parma-lego/'),
        'lego-on-react': path.resolve('./parma_modules/lego-on-react/'),
        assets: path.resolve('./parma_modules/@parma-data-ui/clusterdata/src/assets/'),
        components: path.resolve('./parma_modules/@parma-data-ui/clusterdata/src/components/'),
        constants: path.resolve('./parma_modules/@parma-data-ui/clusterdata/src/constants/'),
        hoc: path.resolve('./parma_modules/@parma-data-ui/clusterdata/src/hoc/'),
        icons: path.resolve('./parma_modules/@parma-data-ui/clusterdata/src/icons/'),
        libs: path.resolve('./parma_modules/@parma-data-ui/clusterdata/src/libs/'),
        utils: path.resolve('./parma_modules/@parma-data-ui/clusterdata/src/utils/'),
        store: path.resolve('./src/store/'),
        'components/ContainerLoader/ContainerLoader': path.resolve('./src/components/ContainerLoader/ContainerLoader'),
        'react-dom': '@hot-loader/react-dom',
        process: 'process/browser',
      },
    },
    module: {
      rules: [
        {
          exclude: /node_modules/,
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: ['file-loader'],
        },
        {
          exclude: /src/,
          include: /node_modules/,
          test: /\.m?js/,
          resolve: {
            fullySpecified: false,
          },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin([
        { from: './src/index.js' },
        env,
        { from: './src/context-path.js' },
        { from: './src/favicon.ico' },
        { from: './src/sprite/sprite-2fc732.svg', to: 'sprites' },
        { from: './src/sprite/sprite-da6479.svg', to: 'sprites' },
        { from: './src/css', to: 'css' },
        { from: './src/fonts', to: 'fonts' },
      ]),
      new HtmlWebpackPlugin({
        filename: 'views/index.ejs',
        template: './src/index.html',
        chunks: ['vendors', 'commons', 'navigation'],
        component: 'navigation',
        templateParameters: {
          dotenv: '<%- dotenv %>',
        },
        biHost,
        portalHost,
        exportHost,
        hash: true,
        favicon: './src/icons/favicon.png',
      }),
      new HtmlWebpackPlugin({
        filename: 'views/navigation.ejs',
        template: './src/index.html',
        chunks: ['vendors', 'commons', 'navigation'],
        component: 'navigation',
        templateParameters: {
          dotenv: '<%- dotenv %>',
        },
        biHost,
        portalHost,
        exportHost,
        hash: true,
      }),
      new HtmlWebpackPlugin({
        filename: 'views/datasets.ejs',
        template: './src/index.html',
        chunks: ['vendors', 'commons', 'dataset'],
        component: 'dataset',
        templateParameters: {
          dotenv: '<%- dotenv %>',
        },
        biHost,
        portalHost,
        exportHost,
        hash: true,
      }),
      new HtmlWebpackPlugin({
        filename: 'views/connections/new.ejs',
        template: './src/index.html',
        chunks: ['vendors', 'commons', 'connection'],
        component: 'connection',
        templateParameters: {
          dotenv: '<%- dotenv %>',
        },
        biHost,
        portalHost,
        exportHost,
        hash: true,
      }),
      new HtmlWebpackPlugin({
        filename: 'views/wizard.ejs',
        template: './src/index.html',
        chunks: ['vendors', 'commons', 'app'],
        component: 'app',
        templateParameters: {
          dotenv: '<%- dotenv %>',
        },
        biHost,
        portalHost,
        exportHost,
        hash: true,
      }),
      new HtmlWebpackPlugin({
        filename: 'views/dashboards.ejs',
        template: './src/index.html',
        chunks: ['vendors', 'commons', 'dash'],
        component: 'dash',
        templateParameters: {
          dotenv: '<%- dotenv %>',
        },
        biHost,
        portalHost,
        exportHost,
        hash: true,
      }),
      new HtmlWebpackPlugin({
        filename: 'views/dashboards_simple.ejs',
        template: './src/index_simple.html',
        chunks: ['vendors', 'commons', 'dash', 'dashboard_simple'],
        component: 'dash',
        templateParameters: {
          dotenv: '<%- dotenv %>',
          hideEdit: '<%= hideEdit %>',
          hideSubHeader: '<%= hideSubHeader %>',
          hideTabs: '<%= hideTabs %>',
          enableCaching: '<%= enableCaching %>',
          cacheMode: '<%= cacheMode %>',
          exportMode: '<%= exportMode %>',
        },
        biHost,
        portalHost,
        exportHost,
        hash: true,
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
      new CompressionPlugin({
        algorithm: 'gzip',
        test: /\.(js|tsx|css|html)$/,
        deleteOriginalAssets: true,
        exclude: /index.js|context-path.js/,
      }),
    ],
  };
};
