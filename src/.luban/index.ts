import { ReactNode } from "react";
import { RematchStore, InitConfig } from "@rematch/core";

import { RouteConfig } from "./router/definitions";
import { RootModel } from "@/index";

export interface Context {
  path: string;
  store: RematchStore<RootModel>;
  [k: string]: unknown;
}

export interface ClassComponent<OWN_PROPS, INIT_PROPS = {}>
  extends React.ComponentClass<OWN_PROPS & INIT_PROPS> {
  getInitialProps?(context: Context): INIT_PROPS | Promise<INIT_PROPS>;
}
export interface FunctionComponent<OWN_PROPS, INIT_PROPS = {}>
  extends React.FunctionComponent<OWN_PROPS & INIT_PROPS> {
  getInitialProps?(context: Context): INIT_PROPS | Promise<INIT_PROPS>;
}

export type ComponentType<P = {}, I = {}> = ClassComponent<P, I> | FunctionComponent<P, I>;

export declare type Page<OWN_PROPS = {}, INIT_PROPS = {}> = ComponentType<OWN_PROPS, INIT_PROPS>;

interface Config {
  root?: string;
  provider?: ({ children }: { children: ReactNode }) => JSX.Element;
  route: RouteConfig;
  models?: InitConfig<RootModel>["models"];
}

export function run(config: Config) {
  return config;
}
