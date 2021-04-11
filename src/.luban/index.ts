import { Config, Context as _Context } from "./store";

export interface Context extends _Context {};

export function run(config: Config) {
  return config;
}

interface Preload {
  default: ComponentType;
}

export interface ClassComponent<OWN_PROPS, INIT_PROPS = {}>
  extends React.ComponentClass<OWN_PROPS & INIT_PROPS> {
  getInitialProps?(context: Context): INIT_PROPS | Promise<INIT_PROPS>;
  preload?: () => Promise<Preload>;
}
export interface FunctionComponent<OWN_PROPS = {}, INIT_PROPS = {}>
  extends React.FunctionComponent<OWN_PROPS & INIT_PROPS> {
  getInitialProps?(context: Context): INIT_PROPS | Promise<INIT_PROPS>;
  preload?: () => Promise<Preload>;
}

export type ComponentType<P = {}, I = {}> = ClassComponent<P, I> | FunctionComponent<P, I>;

export declare type Page<OWN_PROPS = {}, INIT_PROPS = {}> = ComponentType<OWN_PROPS, INIT_PROPS>;
