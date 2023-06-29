const path = require('path');
const { PORTAL_ASSETS_PATH } = require('../../../src/context-path.js');

module.exports = {
  mode: 'production',
  entry: './src/entries/libBuilder.js',
  output: {
    path: path.resolve('./src/entries/dist/'),
    filename: 'bundle.js',
    library: {
      type: 'umd',
      name: 'clustrum',
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
};
