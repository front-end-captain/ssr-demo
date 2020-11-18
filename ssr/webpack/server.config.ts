import path from "path";
import webpack from "webpack";
import WebpackBar from "webpackbar";

import { SRC_PATH, BUILD_PATH, ASSETS_PATH } from "../path";

export function setServerConfig(mode: webpack.Configuration["mode"]): webpack.Configuration {
  const entry = path.join(SRC_PATH, "server.entry.js");

  return {
    mode: mode || "development",
    target: "node",
    entry: ["@babel/polyfill", entry],
    output: {
      path: BUILD_PATH,
      filename: "server-bundle.js",
      libraryTarget: "commonjs2",
      library: "server-output",
      publicPath: ASSETS_PATH,
    },
    externals: Object.keys(require("../../package.json").dependencies),
    module: {
      rules: [
        {
          test: /\.js[x]?$/,
          loader: require.resolve("babel-loader"),
          exclude: /node_modules/,
          options: {
            cacheDirectory: true,
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: mode === "development" ? ["react-hot-loader/babel"] : [],
          },
        },
        {
          test: /\.css$/,
          loader: require.resolve("css-loader"),
          // use: [
          //   {
          //     loader: require.resolve("css-loader"),
          //     options: {
          //       importLoaders: 1,
          //       modules: {
          //         mode: "global",
          //         exportGlobals: true,
          //         localIdentName: "[name]__[local]__[hash:base64:5]",
          //       },
          //     },
          //   },
          //   {
          //     loader: require.resolve("less-loader"),
          //   },
          // ],
        },
      ],
    },
    resolve: {
      extensions: [".js", ".json", ".jsx"],
    },
    node: {
      __dirname: true,
      __filename: true,
    },
    plugins: [new WebpackBar({ name: "[Server]ssr-demo", color: "#41b883" })],
    optimization: {
      splitChunks: false,
    },
  };
}
