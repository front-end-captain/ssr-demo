"use strict";

process.env.NODE_ENV = "development";
process.env.BABEL_ENV = "development";

import url from "url";
import path from "path";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import chalk from "chalk";
import open from "open";
import MemoryFS from "memory-fs";
import express from "express";
import { log } from "@luban-cli/cli-shared-utils";
import { createProxyMiddleware } from "http-proxy-middleware";
import ReactDOMServer from "react-dom/server";
import ejs from "ejs";

import { prepareUrls, UrlList } from "./prepareURLs";
import { IpcMessenger } from "./ipc";
import { getModuleFromString, getTemplate } from "./util";

import { setClientConfig } from "../webpack/client.config";
import { setServerConfig } from "../webpack/server.config";
import { ASSETS_PATH } from "../path";

const defaultCSRServerConfig = {
  host: "0.0.0.0",
  port: 8080,
  https: false,
};

const defaultSSRServerConfig = {
  host: "0.0.0.0",
  port: 4000,
  https: false,
};

const mfs = new MemoryFS();

class Serve {
  private protocol: "http" | "https";
  private CSRUrlList: UrlList | null;
  private SSRUrlList: UrlList | null;

  constructor() {
    this.protocol = "http";
    this.CSRUrlList = null;
    this.SSRUrlList = null;
  }

  startCSRServer() {
    const clientConfig = setClientConfig();

    this.CSRUrlList = prepareUrls(this.protocol, defaultCSRServerConfig.host, defaultCSRServerConfig.port, "/");

    const localUrlForBrowser = this.CSRUrlList.localUrlForBrowser;

    const sockjsUrl =
      "?" +
      url.format({
        protocol: this.protocol,
        port: defaultCSRServerConfig.port,
        hostname: this.CSRUrlList.lanUrlForConfig || "localhost",
        pathname: "/sockjs-node",
      });

    const devClients = [
      require.resolve("webpack-dev-server/client") + sockjsUrl,
      require.resolve("webpack/hot/dev-server"),
    ];

    if (Array.isArray(clientConfig.entry)) {
      clientConfig.entry = devClients.concat(clientConfig.entry);
    }

    const compiler = webpack(clientConfig);

    const webpackDevServerOptions: WebpackDevServer.Configuration = {
      clientLogLevel: "info",
      historyApiFallback: {
        disableDotRule: true,
        rewrites: [{ from: /./, to: path.posix.join(ASSETS_PATH, "index.html") }],
      },
      hot: true,
      compress: true,
      publicPath: ASSETS_PATH,
      overlay: { warnings: false, errors: true },
      open: false,
      stats: {
        version: true,
        timings: true,
        colors: true,
        modules: false,
        children: false,
      },
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

      compiler.hooks.done.tap("csr", (stats) => {
        if (stats.hasErrors()) {
          stats.toJson().errors.forEach((err) => {
            log(err);
          });
          return;
        }

        if (isFirstCompile) {
          isFirstCompile = false;

          console.log();
          console.log(`  CSR running at:`);
          console.log(`  - Local:   ${chalk.cyan(this.CSRUrlList?.localUrlForTerminal)}`);
          console.log(`  - Network: ${chalk.cyan(this.CSRUrlList?.lanUrlForTerminal)}`);
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

      server.listen(defaultCSRServerConfig.port, defaultCSRServerConfig.host, (err) => {
        if (err) {
          reject(err);
        }
      });
    });
  }

  startSSRServer() {
    const server = express();
    const ssrWebpackConfig = setServerConfig();
    const ssrCompiler = webpack(ssrWebpackConfig);

    ssrCompiler.outputFileSystem = mfs;

    let serverBundle = {};

    ssrCompiler.watch({}, (error, stats) => {
      if (error) {
        throw error;
      }

      const info = stats.toJson();
      info.errors.forEach((error) => console.error(error));
      info.warnings.forEach((warn) => console.warn(warn));

      let bundlePath = "";
      if (ssrWebpackConfig.output) {
        if (typeof ssrWebpackConfig.output.filename === "string") {
          bundlePath = path.join(ssrWebpackConfig.output.path || "", ssrWebpackConfig.output.filename);
        }
      }

      const bundle = mfs.readFileSync(bundlePath, "utf-8");

      const m = getModuleFromString(bundle, "server-entry.js");

      serverBundle = m.exports;
    });

    this.SSRUrlList = prepareUrls(this.protocol, defaultSSRServerConfig.host, defaultSSRServerConfig.port, "/");

    server.use(
      "/assets/",
      createProxyMiddleware({
        target: this.CSRUrlList?.localUrlForBrowser,
      }),
    );

    server.get("*", (request, response, next) => {
      if (!serverBundle) {
        return response.send("waiting for serverBundle...");
      }
      getTemplate(this.CSRUrlList?.localUrlForBrowser + "server.ejs")
        .then((template) => {
          const content = ReactDOMServer.renderToString((serverBundle as any).default);

          const html = ejs.render(template, { CONTENT: content });

          // console.log(html);

          return response.send(html);
        })
        .catch(next);
    });

    return new Promise((resolve, reject) => {
      let isFirstCompile = true;

      ssrCompiler.hooks.done.tap("ssr", (stats) => {
        if (stats.hasErrors()) {
          stats.toJson().errors.forEach((err) => {
            log(err);
          });
          return;
        }

        if (isFirstCompile) {
          isFirstCompile = false;

          console.log();
          console.log(` SSR running at:`);
          console.log(`  - Local:   ${chalk.cyan(this.SSRUrlList?.localUrlForTerminal)}`);
          console.log(`  - Network: ${chalk.cyan(this.SSRUrlList?.lanUrlForTerminal)}`);
          console.log();

          resolve({
            server,
            url: this.SSRUrlList?.localUrlForBrowser,
          });
        }
      });

      server.listen(4000, defaultCSRServerConfig.host, () => {
        console.log("ssr server listening at: 4000");
      });
    });
  }

  run() {
    Promise.all([this.startCSRServer(), this.startSSRServer()]).then(() => {
      // TODO
    });
  }
}

new Serve().run();
