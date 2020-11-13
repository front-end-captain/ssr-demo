const webpack = require("webpack");
const webpackMerge = require("webpack-merge");

const { setPublicConfig } = require("./public.config");

const { SRC_PATH, BUILD_PATH, TEMPLATE_PATH } = require("../path");

function setServerConfig() {
  return webpackMerge.merge({
    mode: "development",
    target: "node",
    entry: ["react-hot-loader/patch", path.join(SRC_PATH, "index.js")],
    output: {
      path: BUILD_PATH,
      filename: "server-bundle.js",
      libraryTarget: "commonjs2",
      library: "server-output",
    },
    externals: Object.keys(require("../package.json").dependencies),
  }, setPublicConfig());
}

module.exports = { setServerConfig };
