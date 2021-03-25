interface Window {
  __USE_SSR__?: boolean;
  __INITIAL_DATA__?: any;
}
interface NodeModule {
  hot?: Hot;
}
interface Hot {
  accept(path?: string): void;
}

declare const __IS_BROWSER__: boolean | undefined;