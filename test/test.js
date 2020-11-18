const path = require("path");
const { parse } = require("@babel/parser");
const fs = require("fs");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator");
const { request } = require('http');
const { transform } = require("@babel/core");

const originEntry = path.join(process.cwd(), "./index.js");

const originCode = fs.readFileSync(originEntry, "utf-8");

// const ast = parse(originCode, {
//   sourceType: "module",
//   plugins: ["jsx"],
// });

// const importNode = [];
// let rootComponentName = "";
// traverse(ast, {
//   ImportDeclaration: ({ node }) => {
//     // node.specifiers.filter((s) => s.imported.name);
//     importNode.push(node);
//   },
//   Property: ({ node }) => {
//     // console.log(node);
//     if (node.key.name === "wrapper") {
//       if (node.value.type === "Identifier") {
//         rootComponentName = node.value.name;
//       }
//       if (node.value.type === "JSXElement" || node.value.type === "JSXFragment") {

//       }
//     }
//   },
// });

// const target = importNode.find((node) => {
//   return node.specifiers.filter((s) => {
//     if (s.type === "ImportDefaultSpecifier") {
//       return s.local.name === rootComponentName;
//     }
//     return s.imported.name === rootComponentName;
//   }).length;
// });

// console.log(target.source.value);


// console.log(rootComponentName, target);

// const sockjsUrl =
// "?" +
// url.format({
//   protocol: this.protocol,
//   port: defaultCSRServerConfig.port,
//   hostname: this.CSRUrlList.lanUrlForConfig || "localhost",
//   pathname: "/sockjs-node",
// });

// const devClients = [
// require.resolve("webpack-dev-server/client") + sockjsUrl,
// require.resolve("webpack/hot/dev-server"),
// ];

// if (Array.isArray(clientConfig.entry)) {
// clientConfig.entry = devClients.concat(clientConfig.entry);
// }