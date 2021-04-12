import { ReactNode } from "react";
// @ts-ignore
import { init, RematchStore, InitConfig } from "@rematch/core";
import { OriginRouteConfig } from "./definitions";

// @ts-ignore
import entry from "../";

import { RootModel } from "../";

export const store: RematchStore<RootModel> = init({
  models: entry?.models,
  redux: { initialState: window ? window.__INITIAL_STATE__ || {} : {} },
});

export interface Config {
  root?: string;
  provider?: ({ children }: { children: ReactNode }) => JSX.Element;
  route: OriginRouteConfig;
  models?: InitConfig<RootModel>["models"];
}

export interface Context {
  path: string;
  store: RematchStore<RootModel>;
  [k: string]: unknown;
}
