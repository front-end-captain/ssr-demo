import { ReactNode } from "react";
import { init, RematchStore, InitConfig } from "@rematch/core";
import { OriginRouteConfig } from "./definitions";
import entry from "../";

import { Models, RematchDispatch, RematchRootState } from "@rematch/core";

import { count } from "@/models/count";

export interface RootModel extends Models<RootModel> {
  count: typeof count;
}
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;

export const store: null = null;

export interface Config {
  root?: string;
  provider?: ({ children }: { children: ReactNode }) => JSX.Element;
  route: OriginRouteConfig;
  models?: InitConfig["models"];
}

export interface Context {
  path: string;
  store: null;
  [k: string]: unknown;
}
