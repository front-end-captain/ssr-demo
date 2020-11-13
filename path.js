const path = require("path");

const ROOT_PATH = process.cwd();


const SRC_PATH = path.join(ROOT_PATH, "src");

const BUILD_PATH = path.join(ROOT_PATH, "build");

const PUBLIC_PATH = "/";

const TEMPLATE_PATH = path.join(ROOT_PATH, "template");

module.exports = {
  ROOT_PATH,
  SRC_PATH,
  BUILD_PATH,
  PUBLIC_PATH,
  TEMPLATE_PATH,
};