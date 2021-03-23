interface Window {
  __USE_SSR__?: string;
}
interface NodeModule {
  hot?: Hot;
}
interface Hot {
  accept(path?: string): void;
}
declare const __IS_BROWSER__: boolean;

type Component<P = {}> = React.FunctionComponent<P> & {
  // TODO typeof "params" ???
  getInitialProps?: <T>(params: unknown) => Promise<T>;
};
