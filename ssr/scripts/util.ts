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

  const wrapper = NativeModule.wrap(bundle);

  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: false,
  });

  const result = script.runInThisContext();

  result.call(m.exports, m.exports, require, m);

  return m;
};
