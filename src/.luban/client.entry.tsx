import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { init, RematchStore } from "@rematch/core";

import { LubanRouter } from "./router";
import { flattenRoutes } from "./util";

import entry, { RootModel } from "../";

const Root = entry.provider || (({ children }) => <>{children}</>);
const root = document.getElementById(entry.root || "root");

// console.log("window.__INITIAL_STATE__", window.__INITIAL_STATE__);

export const store: RematchStore<RootModel> = init({
  models: entry?.models,
  redux: { initialState: window.__INITIAL_STATE__ || {} },
});

const routes = flattenRoutes(entry.route.routes, entry.route.fallback);

function App() {
  if (entry.models) {
    return (
      <Provider store={store}>
        <LubanRouter config={{ ...entry.route, routes }}>
          {({ renderedTable }) => {
            return <Root>{renderedTable}</Root>;
          }}
        </LubanRouter>
      </Provider>
    );
  }

  return (
    <LubanRouter config={{ ...entry.route, routes }}>
      {({ renderedTable }) => {
        return <Root>{renderedTable}</Root>;
      }}
    </LubanRouter>
  );
}

function clientRender() {
  ReactDOM["render"](<App />, root);
  // ReactDOM[window.__USE_SSR__ ? "hydrate" : "render"](<App />, root);
}

clientRender();
