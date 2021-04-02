import React from "react";
import { run } from "@/.luban";
import { Models, RematchDispatch, RematchRootState } from "@rematch/core";

import { App } from "./App";

import Home from "./pages/home";
import About from "./pages/about";
import Index from "./pages/index";

import { count } from "./models/count";

export interface RootModel extends Models<RootModel> {
  count: typeof count;
}
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;

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
  models: { count },
});
