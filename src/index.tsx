import React from "react";
import { run } from "luban-ssr";

import { App } from "./App";

import Home from "./pages/home";
import About from "./pages/about";
import Index from "./pages/index";

export default run({
  root: "root",
  provider: (props) => <App {...props} />,
  route: {
    routes: [
      {
        path: "/",
        redirect: "/index",
      },
      {
        path: "/home",
        component: Home,
      },
      {
        path: "/about",
        component: About,
      },
      {
        path: "/index",
        component: Index,
      },
      {
        path: "/brendan",
        redirect: "/about",
      },
    ],
  },
});
