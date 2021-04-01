import React from "react";
import ReactDOM from "react-dom";

import { LubanRouter } from "./router/index";

import entry from "../";

const Root = entry.provider || (({ children }) => <>{children}</>);
const root = document.getElementById(entry.root || "root");

function App() {
  return (
    <LubanRouter config={entry.route}>
      {({ renderedTable }) => {
        return <Root>{renderedTable}</Root>;
      }}
    </LubanRouter>
  );
}

function clientRender() {
  ReactDOM[window.__USE_SSR__ ? "hydrate" : "render"](<App />, root);
}

clientRender();
