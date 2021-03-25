import React, { ReactNode } from "react";

import { App } from "./App";

import Home from "./pages/home";
import About from "./pages/about";

import { ComponentType } from "./typings/react"

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
      path: "/home",
      component: Home,
    },
    {
      path: "/about",
      component: About,
    },
  ],
} as Config;
