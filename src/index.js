import React from "react";

import Home from "./home";
import About from "./about";

/**
 * @type {{ root: string; route: import("luban-router/es/definitions").RouteConfig }}
 */
const config = {
  root: "root",
  route: {
    mode: "hash",
    routes: [
      {
        name: "home",
        component: Home,
      },
      {
        name: "about",
        component: About,
      },
    ],
  },
};

export default config;
