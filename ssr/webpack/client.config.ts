import { merge } from "webpack-merge";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";

import { setPublicConfig } from "./public.config";

import { SRC_PATH, BUILD_PATH, TEMPLATE_PATH, ASSETS_PATH } from "../path";

export function setClientConfig() {
  return merge(
    {
      mode: "development",
      devtool: "cheap-module-eval-source-map",
      entry: ["react-hot-loader/patch", path.join(SRC_PATH, "index.js")],
      output: {
        path: BUILD_PATH,
        filename: "[name]-[hash:8].js",
        publicPath: ASSETS_PATH,
      },
      plugins: [
        new HtmlWebpackPlugin({
          path: BUILD_PATH,
          template: path.join(TEMPLATE_PATH, "client.html"),
          filename: "index.html",
        }),
        new HtmlWebpackPlugin({
          path: BUILD_PATH,
          template: path.join(TEMPLATE_PATH, "server.template.ejs"),
          filename: "server.ejs",
        }),
      ],
    },
    setPublicConfig(),
  );
}
