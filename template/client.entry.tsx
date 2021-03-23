import React from "react";
import ReactDOM from "react-dom";
import { LubanRouter } from "luban-router";

import entry from "../";

console.log("__IS_BROWSER__", __IS_BROWSER__);

const Root = entry.provider;
const root = document.getElementById(entry.root);

function clientRender() {
  ReactDOM[window.__USE_SSR__ ? "hydrate" : "render"](<LubanRouter config={entry.routes} />, root);

  if (module.hot) {
    module.hot.accept();
  }
}

clientRender();
