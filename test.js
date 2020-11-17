const path = require("path");
const { parse } = require("@babel/parser");
const fs = require("fs");
const traverse = require("@babel/traverse").default;

const entry = path.join(process.cwd(), "src/index.js");

const code = fs.readFileSync(entry, "utf-8");

const ast = parse(code, {
  sourceType: "module",
  plugins: ["jsx"],
});

const importNode = [];
let rootComponentName = "";
traverse(ast, {
  ImportDeclaration: ({ node }) => {
    // node.specifiers.filter((s) => s.imported.name);
    importNode.push(node);
  },
  Property: ({ node }) => {
    // console.log(node);
    if (node.key.name === "wrapper") {
      if (node.value.type === "Identifier") {
        rootComponentName = node.value.name;
      }
      if (node.value.type === "JSXElement" || node.value.type === "JSXFragment") {

      }
    }
  },
});

const target = importNode.find((node) => {
  return node.specifiers.filter((s) => {
    if (s.type === "ImportDefaultSpecifier") {
      return s.local.name === rootComponentName;
    }
    return s.imported.name === rootComponentName;
  }).length;
});

console.log(target.source.value);


// console.log(rootComponentName, target);