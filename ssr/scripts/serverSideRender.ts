import ReactDOMServer from "react-dom/server";
import ejs from "ejs";

// dependence: react-dom/server, ejs, serverBundle, template

export function serverSideRender(serverBundle: any, template: string) {
  const reactApp = serverBundle.default();
  const content = ReactDOMServer.renderToString(reactApp);

  return ejs.render(template, { CONTENT: content });
}
