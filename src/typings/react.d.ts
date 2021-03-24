/// <reference types="node" />
import { ServerResponse, IncomingMessage } from "http";
import { ComponentType } from "react";
import { ParsedUrlQuery } from "querystring";

/**
 * `Next` context
 */
export interface LubanPageContext {
  /**
   * Error object if encountered during rendering
   */
  err?:
    | (Error & {
        statusCode?: number;
      })
    | null;
  /**
   * `HTTP` request object.
   */
  req?: IncomingMessage;
  /**
   * `HTTP` response object.
   */
  res?: ServerResponse;
  /**
   * Path section of `URL`.
   */
  pathname: string;
  /**
   * Query string section of `URL` parsed as an object.
   */
  query: ParsedUrlQuery;
  /**
   * `String` of the actual path including query.
   */
  asPath?: string;

  [k: string]: unknown;
}

export declare type LubanComponentType<OWN_PROPS = {}, INIT_PROPS = {}> = ComponentType<
  OWN_PROPS & INIT_PROPS
> & {
  /**
   * Used for initial page load data population. Data returned from `getInitialProps` is serialized when server rendered.
   * Make sure to return plain `Object` without using `Date`, `Map`, `Set`.
   * @param ctx Context of `page`
   */
  getInitialProps?(context: LubanPageContext): INIT_PROPS | Promise<INIT_PROPS>;
};

/**
 * `Page` type, use it as a guide to create `pages`.
 */
export type LubanPage<OWN_PROPS = {}, INIT_PROPS = {}> = LubanComponentType<OWN_PROPS, INIT_PROPS>;

declare module "react" {
  export = React;
  export as namespace React;
  declare namespace React {
    // Base component for plain JS classes
    interface Component<
      OWN_PROPS = {},
      INIT_PROPS = {},
      STATE = {},
      SNAPSHOT = {},
      FINAL = OWN_PROPS & INIT_PROPS
    > extends ComponentLifecycle<FINAL, STATE, SNAPSHOT> {}
    class Component<OWN_PROPS, INIT_PROPS, STATE, FINAL = OWN_PROPS & INIT_PROPS> {
      /**
       * If set, `this.context` will be set at runtime to the current value of the given Context.
       *
       * Usage:
       *
       * ```ts
       * type MyContext = number
       * const Ctx = React.createContext<MyContext>(0)
       *
       * class Foo extends React.Component {
       *   static contextType = Ctx
       *   context!: React.ContextType<typeof Ctx>
       *   render () {
       *     return <>My context's value: {this.context}</>;
       *   }
       * }
       * ```
       *
       * @see https://reactjs.org/docs/context.html#classcontexttype
       */
      static contextType?: Context<unknown>;

      static getInitialProps?(context: LubanPageContext): INIT_PROPS | Promise<INIT_PROPS>;

      /**
       * If using the new style context, re-declare this in your class to be the
       * `React.ContextType` of your `static contextType`.
       * Should be used with type annotation or static contextType.
       *
       * ```ts
       * static contextType = MyContext
       * // For TS pre-3.7:
       * context!: React.ContextType<typeof MyContext>
       * // For TS 3.7 and above:
       * declare context: React.ContextType<typeof MyContext>
       * ```
       *
       * @see https://reactjs.org/docs/context.html
       */
      context: unknown;

      constructor(props: Readonly<FINAL> | FINAL);

      // We MUST keep setState() as a unified signature because it allows proper checking of the method return type.
      // See: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18365#issuecomment-351013257
      // Also, the ` | STATE` allows intellisense to not be dumbisense
      setState<K extends keyof STATE>(
        state:
          | ((prevState: Readonly<STATE>, props: Readonly<FINAL>) => Pick<STATE, K> | STATE | null)
          | (Pick<STATE, K> | STATE | null),
        callback?: () => void,
      ): void;

      forceUpdate(callback?: () => void): void;
      render(): ReactNode;

      // React.Props<T> is now deprecated, which means that the `children`
      // property is not available on `OWN_PROPS` by default, even though you can
      // always pass children as variadic arguments to `createElement`.
      // In the future, if we can define its call signature conditionally
      // on the existence of `children` in `OWN_PROPS`, then we should remove this.
      readonly props: Readonly<FINAL> & Readonly<{ children?: ReactNode }>;
      state: Readonly<STATE>;
    }
  }
}
