import ReactDOMServer from "react-dom/server";
import ejs from "ejs";
import { Request } from "express";

// dependence: react-dom/server, ejs, serverBundle, template

export function serverSideRender(serverBundle: any, template: string, req: Request) {
  const reactApp = serverBundle.default(req.path);
  const content = ReactDOMServer.renderToString(reactApp);

  return ejs.render(template, { CONTENT: content });
}
