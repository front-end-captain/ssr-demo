import React, { ReactNode } from "react";
import { ComponentType } from "luban-ssr";

import { App } from "./App";

import Home from "./pages/home";
import About from "./pages/about";
import Index from "./pages/index";

interface Config {
  root?: string;
  provider?: ({ children }: { children: ReactNode }) => JSX.Element;
  routes?: Array<{ path: string, component: ComponentType }>;
}

export default {
  root: "root",
  provider: (props) => <App {...props} />,
  routes: [
    {
      path: "/",
      component: Index,
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
} as Config;
