import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { init, RematchStore } from "@rematch/core";

import { LubanRouter } from "./router/index";

import entry, { RootModel } from "../";

const Root = entry.provider || (({ children }) => <>{children}</>);
const root = document.getElementById(entry.root || "root");

// console.log("window.__INITIAL_STATE__", window.__INITIAL_STATE__);

export const store: RematchStore<RootModel> = init({
  models: entry?.models,
  redux: { initialState: window.__INITIAL_STATE__ || {} },
});

function App() {
  if (entry.models) {
    return (
      <Provider store={store}>
        <LubanRouter config={entry.route}>
          {({ renderedTable }) => {
            return <Root>{renderedTable}</Root>;
          }}
        </LubanRouter>
      </Provider>
    );
  }

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
