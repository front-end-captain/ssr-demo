import webpack from "webpack";
import WebpackBar from "webpackbar";


export function setPublicConfig(): webpack.Configuration {
  return {
    module: {
      rules: [
        {
          test: /\.js[x]?$/,
          loader: require.resolve("babel-loader"),
          exclude: /node_modules/,
          options: {
            cacheDirectory: true,
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: ["react-hot-loader/babel"],
          },
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: require.resolve("style-loader"),
            },
            {
              loader: require.resolve("css-loader"),
              options: {
                importLoaders: 1,
                modules: {
                  mode: "global",
                  exportGlobals: true,
                  localIdentName: "[name]__[local]__[hash:base64:5]",
                },
              },
            },
            {
              loader: require.resolve("less-loader"),
            },
          ],
        },
        {
          test: /\.ejs$/,
          loader: require.resolve("ejs-loader"),
          options: {
            variable: "data",
            interpolate: "\\{\\{(.+?)\\}\\}",
            evaluate: "\\[\\[(.+?)\\]\\]",
          },
        },
      ],
    },
    resolve: {
      extensions: [".js", ".json", ".jsx"],
    },
    plugins: [
      new webpack.ProvidePlugin({
        _: "underscore",
      }),
      new WebpackBar({ name: "ssr-demo", color: "#41b883" }),
    ],
  };
}

