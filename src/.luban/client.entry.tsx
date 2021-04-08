import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { init, RematchStore } from "@rematch/core";
import Loadable from "react-loadable";
import { pathToRegexp } from "path-to-regexp";
import cloneDeepWith from "lodash.clonedeepwith";

import { LubanRouter } from "./router";
import { flattenRoutes } from "./util";

import entry, { RootModel } from "../";
import dynamicRoute from "./dynamicRoutes";
import { BasicRouterItem } from "./definitions";

const Root = entry.provider || (({ children }) => <>{children}</>);
const root = document.getElementById(entry.root || "root");

export const store: RematchStore<RootModel> = init({
  models: entry?.models,
  redux: { initialState: window.__INITIAL_STATE__ || {} },
});

const _routes = flattenRoutes(dynamicRoute);

async function preloadComponent(routes: BasicRouterItem[]): Promise<BasicRouterItem[]> {
  const baseName = entry.route.basename;
  const pathName = baseName ? location.pathname.replace(baseName, "") : location.pathname;

  const copyRoutes = cloneDeepWith(routes);

  for (let i in copyRoutes) {
    const { component, path } = copyRoutes[i];
    let activeComponent = component;
    if (activeComponent && activeComponent.preload && pathToRegexp(path).test(pathName)) {
      activeComponent = (await activeComponent.preload()).default;
    }
    copyRoutes[i].component = activeComponent;
  }
  return copyRoutes;
}

function App(props: { routes: BasicRouterItem[] }) {
  let Container = (
    <LubanRouter config={{ ...entry.route, routes: props.routes }}>
      {({ renderedTable }) => {
        return <Root>{renderedTable}</Root>;
      }}
    </LubanRouter>
  );

  if (entry.models) {
    return <Provider store={store}>{Container}</Provider>;
  }

  return Container;
}

async function clientRender() {
  const loadedRoutes = await preloadComponent(_routes);

  Loadable.preloadReady().then(() => {
    [ReactDOM[window.__USE_SSR__ ? "hydrate" : "render"](<App routes={loadedRoutes} />, root)];
  });
}

clientRender();
