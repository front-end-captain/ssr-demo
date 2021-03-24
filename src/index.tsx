import React, { ReactNode } from "react";
import { RouteConfig } from "luban-router/es/definitions";

import { App } from "./App";

import Home from "./pages/home";
import About from "./pages/about";

interface Config {
  root?: string;
  provider?: ({ children }: { children: ReactNode }) => JSX.Element;
  routes?: RouteConfig;
}

export default {
  root: "root",
  provider: (props) => <App {...props} />,
  routes: {
    routes: [
      {
        path: "/",
        redirect: "/home",
      },
      {
        path: "/home",
        component: Home,
      },
      {
        path: "/about",
        component: About,
      },
    ],
  },
} as Config;
