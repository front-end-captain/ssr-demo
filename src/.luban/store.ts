import { ReactNode } from "react";
// @ts-ignore
import { init, RematchStore, InitConfig } from "@rematch/core";
import { OriginRouteConfig } from "./definitions";

// @ts-ignore
import entry from "../";



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
