import fetch from "isomorphic-fetch";
import NativeModule from "module";
import vm from "vm";
import ejs, { Options as EJSOptions, Data as EJSRenderInputData } from "ejs";
import fs from "fs";
import path from "path";
import globby from "globby";

export const getTemplate = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response: any) => {
        if (response.status >= 400) {
          reject(new Error("Bad response from server"));
        }
        resolve(response.text());
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

export const getModuleFromString = (bundle: string, filename: string) => {
  const m = { exports: {} };

  const wrapper = NativeModule.wrap(bundle);

  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: false,
  });

  const result = script.runInThisContext();

  result.call(m.exports, m.exports, require, m);

  return m;
};

export function renderFile(name: string, data: EJSRenderInputData, ejsOptions: EJSOptions): string {
  const template = fs.readFileSync(name, "utf-8");

  return ejs.render(template, data, { ...ejsOptions, async: false });
}

function extractCallDir(): string {
  const errorStack: { stack: string } = { stack: "" };
  Error.captureStackTrace(errorStack);

  const callSite = errorStack.stack.split("\n")[3];

  if (callSite) {
    const fileNameMatchResult = callSite.match(/\s\((.*):\d+:\d+\)$/);
    if (Array.isArray(fileNameMatchResult)) {
      return path.dirname(fileNameMatchResult[1]);
    }
  }

  return "";
}

export async function render(dir: string, additionalData: Record<string, unknown> = {}, ejsOptions: EJSOptions = {}) {
  const baseDir = extractCallDir();

  const source = path.resolve(baseDir, dir);

  const _files = await globby(["**/*"], { cwd: source as string });

  const files: Record<string, string> = {};

  for (const rawPath of _files) {
    const sourcePath = path.resolve(source as string, rawPath);
    const content = renderFile(sourcePath, additionalData, ejsOptions);

    if (Buffer.isBuffer(content) || /[^\s]/.test(content)) {
      files[rawPath] = content;
    }
  }

  return files;
}

export function delay(value: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, value);
  })
}
