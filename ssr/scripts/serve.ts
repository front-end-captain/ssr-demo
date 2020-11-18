"use strict";

process.env.NODE_ENV = "development";
process.env.BABEL_ENV = "development";

import http from "http";
import path from "path";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import chalk from "chalk";
import open from "open";
import MemoryFS from "memory-fs";
import express from "express";
import { log } from "@luban-cli/cli-shared-utils";
import { createProxyMiddleware } from "http-proxy-middleware";
import BodyParser from "body-parser";

import { prepareUrls, UrlList } from "./prepareURLs";
import { getModuleFromString, getTemplate } from "./util";

import { setClientConfig } from "../webpack/client.config";
import { setServerConfig } from "../webpack/server.config";
import { ASSETS_PATH } from "../path";
import { serverSideRender } from "./serverSideRender";

const defaultCSRServerConfig = {
  host: "0.0.0.0",
  port: 8080,
  https: false,
};

const defaultSSRServerConfig = {
  host: "0.0.0.0",
  port: 3000,
  https: false,
};

const mfs = new MemoryFS();

class Serve {
  private protocol: "http" | "https";
  private CSRUrlList: UrlList | null;
  private SSRUrlList: UrlList | null;
  private csrCompiler: webpack.Compiler | null;
  private ssrCompiler: webpack.Compiler | null;
  private csrServer: WebpackDevServer | null;
  private ssrServer: http.Server | null;
  private isFirstCSRCompile: boolean;
  private isFirstSSRCompile: boolean;

  constructor() {
    this.protocol = "http";
    this.CSRUrlList = null;
    this.SSRUrlList = null;

    this.csrServer = null;
    this.ssrServer = null;
    this.csrCompiler = null;
    this.ssrCompiler = null;

    this.isFirstCSRCompile = true;
    this.isFirstSSRCompile = true;
  }

  startCSRServer() {
    const clientConfig = setClientConfig("development");

    this.CSRUrlList = prepareUrls(this.protocol, defaultCSRServerConfig.host, defaultCSRServerConfig.port, "/");

    this.csrCompiler = webpack(clientConfig);

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
      stats: false,
      // stats: {
      //   version: true,
      //   timings: true,
      //   colors: true,
      //   modules: false,
      //   children: false,
      // },
    };

    this.csrServer = new WebpackDevServer(this.csrCompiler, webpackDevServerOptions);

    return new Promise((resolve, reject) => {
      this.csrCompiler?.hooks.done.tap("csr", (stats) => {
        if (stats.hasErrors()) {
          stats.toJson().errors.forEach((err) => {
            log(err);
          });
          return;
        }

        if (this.isFirstCSRCompile) {
          this.isFirstCSRCompile = false;

          console.log();
          console.log(`  CSR running at:`);
          console.log(`  - Local:   ${chalk.cyan(this.CSRUrlList?.localUrlForTerminal)}`);
          console.log(`  - Network: ${chalk.cyan(this.CSRUrlList?.lanUrlForTerminal)}`);
          console.log();

          resolve();
        }
      });

      this.csrServer?.listen(defaultCSRServerConfig.port, defaultCSRServerConfig.host, (err) => {
        if (err) {
          reject(err);
        }
      });
    });
  }

  startSSRServer() {
    const server = express();
    const ssrWebpackConfig = setServerConfig("development");

    this.SSRUrlList = prepareUrls(this.protocol, defaultSSRServerConfig.host, defaultSSRServerConfig.port, "/");

    this.ssrCompiler = webpack(ssrWebpackConfig);

    this.ssrCompiler.outputFileSystem = mfs;

    let serverBundle = {};

    this.ssrCompiler.watch({}, (error, stats) => {
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

    server.use((request, _, next) => {
      console.log();
      console.log(
        "The request type is " +
          chalk.green(request.method) +
          "; request url is " +
          chalk.green(request.originalUrl) +
          "; " +
          chalk.yellow(new Date().toUTCString()),
      );
      next();
    });

    server.use(BodyParser.json());
    server.use(BodyParser.urlencoded({ extended: false }));

    const assetsProxy = createProxyMiddleware({
      ws: true,
      target: this.CSRUrlList?.localUrlForBrowser,
    });

    server.use(ASSETS_PATH, assetsProxy);

    server.get("*", (_, response, next) => {
      if (!serverBundle) {
        return response.send("waiting for serverBundle...");
      }

      const templateUrl = this.CSRUrlList?.localUrlForBrowser + ASSETS_PATH + "server.ejs";

      getTemplate(templateUrl.replace(/(\d+)[(^/)](\/)+/, "$1$2"))
        .then((template) => {
          return response.send(serverSideRender(serverBundle, template));
        })
        .catch(next);
    });

    return new Promise((resolve, reject) => {
      this.ssrCompiler?.hooks.done.tap("ssr", (stats) => {
        if (stats.hasErrors()) {
          stats.toJson().errors.forEach((err) => {
            log(err);
          });
          return;
        }

        if (this.isFirstSSRCompile) {
          this.isFirstSSRCompile = false;

          console.log();
          console.log(`  SSR running at:`);
          console.log(`  - Local:   ${chalk.cyan(this.SSRUrlList?.localUrlForTerminal)}`);
          console.log(`  - Network: ${chalk.cyan(this.SSRUrlList?.lanUrlForTerminal)}`);
          console.log();

          resolve();
        }
      });

      this.ssrServer = server.listen(defaultSSRServerConfig.port, defaultSSRServerConfig.host);

      this.ssrServer.on("upgrade", assetsProxy.upgrade as (...args: any[]) => void);
      this.ssrServer.on("error", (error) => reject(error));
    });
  }

  run() {
    return Promise.all([this.startCSRServer(), this.startSSRServer()]).then(() => {
      open(this.CSRUrlList?.localUrlForBrowser || "").catch(() => undefined);
      open(this.SSRUrlList?.localUrlForBrowser || "").catch(() => undefined);

      ["SIGINT", "SIGTERM"].forEach((signal) => {
        process.on(signal, () => {
          this.ssrServer?.close();
          this.csrServer?.close();
          process.exit();
        });
      });
    });
  }
}

new Serve().run();
