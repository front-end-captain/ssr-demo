import React from "react";
import { StaticRouter, Redirect } from "react-router-dom";
import { pathToRegexp } from "path-to-regexp";
import { StaticRouterContext, StaticRouterProps } from "react-router";
import { DefaultNotFound } from "./defaultNotfound";
import { warn } from "./log";
import { flattenRoutes } from "./util";

import entry from "../";
import staticRoute from "./staticRoutes";

const Root = entry.wrapper || (({ children }) => <>{children}</>);

const _routes = flattenRoutes(staticRoute);

async function serverRender(
  context: { path: string; initProps: {}; initState: {} },
  staticRouterContext: StaticRouterContext,
  store: null,
) {
  const staticRouterProps: StaticRouterProps = {
    location: context.path,
    basename: entry.route.basename,
  };

  let App = <StaticRouter {...staticRouterProps} context={staticRouterContext} />;

  if (["/favicon.ico", "/sockjs-node/info"].includes(context.path)) {
    // do nothing
  } else {
    const activityRoute = _routes.find((routeItem) => {
      return pathToRegexp(routeItem.path, [], { strict: true }).test(context.path);
    });

    if (!activityRoute) {
      warn(`Not found activity route item; path: ${context.path}`);

      App = (
        <StaticRouter {...staticRouterProps} context={staticRouterContext}>
          <Root>
            <DefaultNotFound />
          </Root>
        </StaticRouter>
      );
    } else {
      const ActivityComponent = activityRoute.component;

      if (!ActivityComponent) {
        const redirectPath = activityRoute.redirect || "/";
        warn(`Not config route component; path: ${context.path}, redirect: ${redirectPath}`);

        staticRouterContext.statusCode = 302;

        App = (
          <StaticRouter {...staticRouterProps} context={staticRouterContext}>
            <Root>
              <Redirect from={context.path} to={redirectPath} />
            </Root>
          </StaticRouter>
        );
      } else {
        let initProps = {};
        if (typeof ActivityComponent.getInitialProps === "function") {
          // @ts-ignore
          initProps = await ActivityComponent.getInitialProps({ path: context.path, store });
        }

        context.initProps = initProps;

        App = (
          <StaticRouter {...staticRouterProps} context={staticRouterContext}>
            <Root>
              <ActivityComponent {...initProps} />
            </Root>
          </StaticRouter>
        );
      }
    }
  }

  return App;
}

export default serverRender;
