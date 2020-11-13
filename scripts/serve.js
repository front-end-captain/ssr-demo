"use strict";

process.env.NODE_ENV = "development";
process.env.BABEL_ENV = "development";

const url = require("url");
const path = require("path");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const chalk = require("chalk");
const open = require("open");
const MemoryFS = require("memory-fs");
const NativeModule = require("module");
const vm = require("vm");

const { prepareUrls } = require("./prepareURLs");
const { IpcMessenger } = require("./ipc");

const { setClientConfig } = require("../webpack/client.config");
const { setServerConfig } = require("../webpack/server.config");

const defaultServerConfig = {
  host: "0.0.0.0",
  port: 8080,
  https: false,
};

const protocol = "http";

const mfs = new MemoryFS();

function serve() {
  const clientConfig = setClientConfig();

  const urls = prepareUrls(protocol, defaultServerConfig.host, defaultServerConfig.port, "/");

  const localUrlForBrowser = urls.localUrlForBrowser;

  const sockjsUrl =
    "?" +
    url.format({
      protocol,
      port: defaultServerConfig.port,
      hostname: urls.lanUrlForConfig || "localhost",
      pathname: "/sockjs-node",
    });

  const devClients = [
    require.resolve("webpack-dev-server/client") + sockjsUrl,
    require.resolve("webpack/hot/dev-server"),
  ];

  clientConfig.entry = devClients.concat(clientConfig.entry);

  const compiler = webpack(clientConfig);

  // const serverCompiler = webpack(setServerConfig());
  // serverCompiler.outputFileSystem = mfs;

  const webpackDevServerOptions = {
    clientLogLevel: "info",
    historyApiFallback: {
      disableDotRule: true,
      rewrites: [{ from: /./, to: path.posix.join("/", "index.html") }],
    },
    hot: true,
    compress: true,
    publicPath: "/",
    overlay: { warnings: false, errors: true },
    open: false,
    stats: {
      version: true,
      timings: true,
      colors: true,
      modules: false,
      children: false,
    },
    // before: (app) => {
    //   app.get("*", (req, res, next) => {
    //     console.log(req.url);
    //     if (req.url === "/") {
    //       return res.send('hello brendan.ye');
    //     }
    //     next();
    //   });
    // },
  };

  const server = new WebpackDevServer(compiler, webpackDevServerOptions);

  ["SIGINT", "SIGTERM"].forEach((signal) => {
    process.on(signal, () => {
      server.close();
      process.exit();
    });
  });

  return new Promise((resolve, reject) => {
    let isFirstCompile = true;

    compiler.hooks.done.tap("serve", (stats) => {
      if (stats.hasErrors()) {
        stats.toJson().errors.forEach((err) => {
          log(err);
        });
        return;
      }

      if (isFirstCompile) {
        isFirstCompile = false;

        console.log();
        console.log(`  App running at:`);
        console.log(`  - Local:   ${chalk.cyan(urls.localUrlForTerminal)}`);
        console.log(`  - Network: ${chalk.cyan(urls.lanUrlForTerminal)}`);
        console.log();

        open(localUrlForBrowser).catch(() => undefined);

        // Send final app URL
        const ipc = new IpcMessenger();
        ipc.send({
          lubanServer: {
            url: localUrlForBrowser,
          },
        });

        resolve({
          server,
          url: localUrlForBrowser,
        });
      }
    });

    server.listen(defaultServerConfig.port, defaultServerConfig.host, (err) => {
      if (err) {
        reject(err);
      }
    });
  });
}

serve().catch((e) => {
  console.log(e);
});
