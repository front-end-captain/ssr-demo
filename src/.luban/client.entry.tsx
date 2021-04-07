import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { init, RematchStore } from "@rematch/core";
import Loadable from "react-loadable";

import { LubanRouter } from "./router";
import { flattenRoutes } from "./util";

import entry, { RootModel } from "../";
import dynamicRoute from "./dynamicRoutes";

const Root = entry.provider || (({ children }) => <>{children}</>);
const root = document.getElementById(entry.root || "root");

export const store: RematchStore<RootModel> = init({
  models: entry?.models,
  redux: { initialState: window.__INITIAL_STATE__ || {} },
});

const _routes = flattenRoutes(dynamicRoute);

function App() {
  if (entry.models) {
    return (
      <Provider store={store}>
        <LubanRouter config={{ ...entry.route, routes: _routes }}>
          {({ renderedTable }) => {
            return <Root>{renderedTable}</Root>;
          }}
        </LubanRouter>
      </Provider>
    );
  }

  return (
    <LubanRouter config={{ ...entry.route, routes: _routes }}>
      {({ renderedTable }) => {
        return <Root>{renderedTable}</Root>;
      }}
    </LubanRouter>
  );
}

function clientRender() {
  Loadable.preloadReady().then(() => {
    [ReactDOM[window.__USE_SSR__ ? "hydrate" : "render"](<App />, root)];
  });
}

clientRender();
