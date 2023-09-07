const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv').config({ path: path.resolve('./environment/.env') });
const { PORTAL_ASSETS_PATH } = require('../../../src/context-path.js');

const primaryColor = dotenv.parsed?.PRIMARY_COLOR;

module.exports = {
  mode: 'production',
  entry: {
    dashBuild: './src/entries/dashBuild.js',
    datasetBuild: './src/entries/datasetBuild.js',
    wizardBuild: './src/entries/wizardBuild.js',
    navigationBuild: './src/entries/navigationBuild.js',
    bundle: './src/entries/libBuilder.js',
  },
  experiments: {
    outputModule: true,
  },
  output: {
    path: path.resolve('./src/entries/dist/'),
    filename: '[name].js',
    library: {
      type: 'module',
    },
    globalObject: 'this',
    publicPath: PORTAL_ASSETS_PATH,
  },
  externals: {
    react: 'react',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.mjs'],
    preferRelative: false,
    alias: {
      '@pages': path.resolve('./src/pages/'),
      '@widgets': path.resolve('./src/widgets/'),
      '@features': path.resolve('./src/features/'),
      '@entities': path.resolve('./src/entities/'),
      '@shared': path.resolve('./src/shared/'),
      '@clustrum-lib': path.resolve('./src/clustrum-lib/src/'),
      '@clustrum-lib-legacy': path.resolve('./src/clustrum-lib/src/legacy-index'),
      '@lib-modules': path.resolve('./src/clustrum-lib/src/modules/'),
      '@lib-widgets': path.resolve('./src/clustrum-lib/src/widgets/'),
      '@lib-features': path.resolve('./src/clustrum-lib/src/features/'),
      '@lib-entities': path.resolve('./src/clustrum-lib/src/entities/'),
      '@lib-shared': path.resolve('./src/clustrum-lib/src/shared/'),
      '@kamatech-ui': path.resolve('./kamatech_modules/kamatech-ui'),
      '@kamatech-data-ui': path.resolve('./kamatech_modules/@kamatech-data-ui/'),
      '@kamatech-lego': path.resolve('./kamatech_modules/@kamatech-lego/'),
      'lego-on-react': path.resolve('./kamatech_modules/lego-on-react/'),
      assets: path.resolve('./kamatech_modules/@kamatech-data-ui/clustrum/src/assets/'),
      components: path.resolve(
        './kamatech_modules/@kamatech-data-ui/clustrum/src/components/',
      ),
      constants: path.resolve(
        './kamatech_modules/@kamatech-data-ui/clustrum/src/constants/',
      ),
      hoc: path.resolve('./kamatech_modules/@kamatech-data-ui/clustrum/src/hoc/'),
      icons: path.resolve('./kamatech_modules/@kamatech-data-ui/clustrum/src/icons/'),
      libs: path.resolve('./kamatech_modules/@kamatech-data-ui/clustrum/src/libs/'),
      utils: path.resolve('./kamatech_modules/@kamatech-data-ui/clustrum/src/utils/'),
      store: path.resolve('./src/store/'),
      'components/ContainerLoader/ContainerLoader': path.resolve(
        './src/components/ContainerLoader/ContainerLoader',
      ),
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
        exclude: /\.module\.css$/,
      },
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
            },
          },
        ],
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
    new webpack.DefinePlugin({
      BUILD_SETTINGS: JSON.stringify({
        isLib: true,
      }),
      'process.env.REACT_APP_PRIMARY_COLOR': JSON.stringify(primaryColor),
    }),
  ],
};
