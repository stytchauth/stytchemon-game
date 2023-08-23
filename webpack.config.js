const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require('webpack')
const dotenv = require('dotenv')

// For setting Stytch public_token
dotenv.config();

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".js"],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
  },
  mode: "development",
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "sounds", to: "sounds" },
        { from: "sprites", to: "sprites" },
        { from: "index.html", to: "index.html" },
        { from: "magic_links", to:"magic_links"}
      ],
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    }),
  ],
};
