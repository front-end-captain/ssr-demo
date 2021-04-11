import React from "react";
import { run } from "@/.luban";
import { App } from "./App";
import { Models, RematchDispatch, RematchRootState } from "@rematch/core";

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
        component: "@/pages/home",
      },
      {
        path: "/about",
        component: "@/pages/about",
      },
      {
        path: "/index",
        component: "@/pages/index",
      },
      {
        path: "/brendan",
        redirect: "/about",
      },
    ],
  },
  models: { count },
});
