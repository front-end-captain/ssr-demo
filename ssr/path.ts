const path = require("path");

export const ROOT_PATH = path.join(process.cwd(), "..");

export const SRC_PATH = path.join(ROOT_PATH, "src");

export const BUILD_PATH = path.join(ROOT_PATH, "build");

export const PUBLIC_PATH = "/";

export const ASSETS_PATH = "/assets/";

export const TEMPLATE_PATH = path.join(ROOT_PATH, "ssr/template");
