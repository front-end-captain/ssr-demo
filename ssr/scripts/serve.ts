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
import { log, info } from "@luban-cli/cli-shared-utils";
import { createProxyMiddleware } from "http-proxy-middleware";
import BodyParser from "body-parser";
import fs from "fs-extra";
import ReactDOMServer from "react-dom/server";
import ejs from "ejs";

import { prepareUrls, UrlList } from "./prepareURLs";
import { getModuleFromString, getTemplate, render, delay } from "./util";

import { setClientConfig } from "../webpack/client.config";
import { setServerConfig } from "../webpack/server.config";
import { ASSETS_PATH } from "../path";

import { SRC_PATH, ROOT_PATH } from "../path";

export type Context = { path: string; initProps: {} };
export type ServerEntry = (req: Context) => null | Promise<JSX.Element>;

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

  private startCSRServer() {
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
    };

    this.csrServer = new WebpackDevServer(this.csrCompiler, webpackDevServerOptions);

    return new Promise((resolve, reject) => {
      this.csrCompiler?.hooks.done.tap("done", (stats) => {
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

  private startSSRServer() {
    const server = express();
    const ssrWebpackConfig = setServerConfig("development");

    this.SSRUrlList = prepareUrls(this.protocol, defaultSSRServerConfig.host, defaultSSRServerConfig.port, "/");

    this.ssrCompiler = webpack(ssrWebpackConfig);

    this.ssrCompiler.outputFileSystem = mfs;

    let serverBundle: { default: ServerEntry } = { default: () => null };

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

    server.use(BodyParser.json());
    server.use(BodyParser.urlencoded({ extended: false }));

    const assetsProxy = createProxyMiddleware({
      ws: true,
      target: this.CSRUrlList?.localUrlForBrowser,
      logLevel: "silent",
    });

    server.use(ASSETS_PATH, assetsProxy);

    server.get("*", async (req, response, next) => {
      if (!serverBundle) {
        return response.send("waiting for serverBundle...");
      }

      try {
        const templateUrl = this.CSRUrlList?.localUrlForBrowser + ASSETS_PATH + "server.ejs";

        const template = await getTemplate(templateUrl.replace(/(\d+)[(^/)](\/)+/, "$1$2"));

        const context = { path: req.path, initProps: {} };
        const reactApp = await serverBundle.default(context);

        let html = "";
        if (reactApp) {
          const content = ReactDOMServer.renderToString(reactApp);

          html = ejs.render(template, {
            CONTENT: content,
            __INITIAL_DATA__: JSON.stringify(context.initProps),
            __USE_SSR__: true,
          });
        }

        response.send(html);
      } catch (err) {
        next(err);
      }
    });

    return new Promise((resolve, reject) => {
      this.ssrCompiler?.hooks.done.tap("done", (stats) => {
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

  private async produce() {
    info("produce files ...");

    const templatePath = path.join(ROOT_PATH, "ssr/.luban_cache");

    const targetPath = `${SRC_PATH}/.luban`;

    if (fs.existsSync(targetPath)) {
      fs.removeSync(targetPath);
    }

    const files = await render(templatePath);

    Object.keys(files).forEach((name) => {
      const filePath = path.join(targetPath, name);
      fs.ensureDirSync(path.dirname(filePath));
      fs.writeFileSync(filePath, files[name]);
    });
  }

  public async start() {
    await this.produce();

    await delay(1000);

    console.log();

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

new Serve().start();
