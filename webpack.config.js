
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const path = require('path');

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
   optimization: {
   usedExports: true,
 },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ],
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'modules',
          chunks: 'all'
        }
      }
    }
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js','.jsx'],
  },
  output: {
    filename: '[name].app.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new MonacoWebpackPlugin()
  ]
};  