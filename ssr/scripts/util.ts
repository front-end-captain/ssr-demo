import fetch from "isomorphic-fetch";
import NativeModule from "module";
import vm from "vm";

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

  // 对 bundle 内的代码用模块包装器进行包装
  // (function( exports, require, module, __dirname, __filename ) { bundle code })
  const wrapper = NativeModule.wrap(bundle);

  // 对代码进行编译但是不执行代码
  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: false,
  });

  // 在当前 global 对象的上下文中执行编译后的代码 最后返回结果
  // function( exports, require, module, __dirname, __filename ) { compiled code }
  const result = script.runInThisContext();

  // 执行函数
  result.call(m.exports, m.exports, require, m);
  return m;
};
