const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    background: './src/background.js',
    popup: './src/popup.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        // 複製所有靜態檔案
        { from: "src/*.html", to: "[name][ext]" },
        { from: "src/*.css", to: "[name][ext]" },
        { from: "src/*.json", to: "[name][ext]" },
        { from: "src/*.png", to: "[name][ext]" }
      ]
    })
  ]
};