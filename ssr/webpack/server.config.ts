import path from "path";
import webpack from "webpack";
import WebpackBar from "webpackbar";
import nodeExternals from "webpack-node-externals";

import { SRC_PATH, BUILD_PATH, ASSETS_PATH } from "../path";

export function setServerConfig(
  mode: webpack.Configuration["mode"]
): webpack.Configuration {
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
    externals: [
      nodeExternals({
        allowlist: /\.(css|less|sass|scss)$/,
      }),
    ],
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
    plugins: [
      new WebpackBar({ name: "[Server]ssr-demo", color: "#41b883" }),
      new webpack.DefinePlugin({ __IS_BROWSER__: false }),
    ],
    optimization: {
      splitChunks: false,
    },
  };
}
