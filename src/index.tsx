import React from "react";
import {Config} from "luban-ssr";

import {App} from "./App";

import Home from "./pages/home";
import About from "./pages/about";
// import Index from "./pages/index";

export default {
  root: "root",
  provider: (props) => <App {...props} />,
  route: {
    routes: [
      {
        path: "/",
        redirect: "/home",
        // component: Index,
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
