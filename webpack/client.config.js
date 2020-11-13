const path = require("path");
const webpackMerge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackBar = require("webpackbar");

const { setPublicConfig } = require("./public.config");

const { SRC_PATH, BUILD_PATH, TEMPLATE_PATH } = require("../path");

function setClientConfig() {
  return webpackMerge.merge(
    {
      mode: "development",
      devtool: "cheap-module-eval-source-map",
      entry: ["react-hot-loader/patch", path.join(SRC_PATH, "index.js")],
      output: {
        path: BUILD_PATH,
        filename: "[name]-[hash:8].js",
      },
      plugins: [
        new HtmlWebpackPlugin({
          path: BUILD_PATH,
          template: path.join(TEMPLATE_PATH, "client.html"),
        }),
        new WebpackBar({ name: "ssr-demo", color: "#41b883" }),
      ],
    },
    setPublicConfig(),
  );
}

module.exports = { setClientConfig };
