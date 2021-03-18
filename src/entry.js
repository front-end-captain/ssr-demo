import React from "react";
import { render, hydrate } from "react-dom";

import LubanRouter from "luban-router";

import config from "./index";

function clientRender() {
  const root = document.getElementById(config.root);
}

function serverRender(ctx) {
  const ActiveComponent = getComponent(config.route, ctx.path)();
  // const Layout = ActiveComponent.Layout || defaultLayout;
  const serverData = ActiveComponent.getInitialProps ? await ActiveComponent.getInitialProps(ctx) : {};
  ctx.serverData = serverData;

  return (
    <StaticRouter location={ctx.req.url} context={serverData}>
      {/* <Layout layoutData={ctx}> */}
        <ActiveComponent {...serverData} />
      {/* </Layout> */}
    </StaticRouter>
  );
}

export default __IS_BROWSER__ ? clientRender() : serverRender;