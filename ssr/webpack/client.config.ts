import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import webpack from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import WebpackBar from "webpackbar";

import { SRC_PATH, BUILD_PATH, TEMPLATE_PATH, ASSETS_PATH } from "../path";

export function setClientConfig(
  mode: webpack.Configuration["mode"]
): webpack.Configuration {
  const entry = path.join(SRC_PATH, "client.entry.js");
  return {
    mode: mode || "development",
    devtool:
      mode === "development"
        ? "@cheap-module-eval-source-map"
        : "@cheap-source-map",
    entry: mode === "development" ? ["react-hot-loader/patch", entry] : [entry],
    output: {
      path: BUILD_PATH,
      filename: "[name]-[hash:8].js",
      publicPath: ASSETS_PATH,
    },
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
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: require.resolve("css-loader"),
              // options: {
              //   importLoaders: 1,
              //   modules: {
              //     mode: "global",
              //     exportGlobals: true,
              //     localIdentName: "[name]__[local]__[hash:base64:5]",
              //   },
              // },
            },
            // {
            //   loader: require.resolve("less-loader"),
            // },
          ],
        },
        {
          test: /\.ejs$/,
          loader: require.resolve("ejs-compiled-loader"),
          options: {
            htmlmin: true,
            htmlminOptions: {
              removeComments: true,
            },
          },
        },
      ],
    },
    resolve: {
      extensions: [".js", ".json", ".jsx"],
    },
    plugins: [
      new HtmlWebpackPlugin({
        path: BUILD_PATH,
        template: path.join(TEMPLATE_PATH, "client.template.html"),
        filename: "index.html",
      }),
      new HtmlWebpackPlugin({
        path: BUILD_PATH,
        template: path.join(TEMPLATE_PATH, "server.template.ejs"),
        filename: "server.ejs",
      }),
      new webpack.HotModuleReplacementPlugin(),
      new MiniCssExtractPlugin({
        filename: mode === "development" ? "[name].css" : "[name]-[hash].css",
        chunkFilename: mode === "development" ? "[id].css" : "[id]-[hash].css",
      }),
      new WebpackBar({ name: "[Client]ssr-demo", color: "#41b883" }),
      new webpack.DefinePlugin({ __IS_BROWSER__: true }),
    ],
  };
}
