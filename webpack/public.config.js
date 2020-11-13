function setPublicConfig() {
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
      ],
    },
    resolve: {
      extensions: [".js", ".json", ".jsx"],
    },
  };
}

module.exports = { setPublicConfig };
