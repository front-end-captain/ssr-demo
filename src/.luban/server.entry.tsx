import React from "react";
import { StaticRouter, Redirect } from "react-router-dom";
import { pathToRegexp } from "path-to-regexp";
import { StaticRouterContext, StaticRouterProps } from "react-router";

import { DefaultNotFound } from "./router/defaultNotfound";
import { warn } from "./log";

import entry from "../";

const Root = entry.provider || (({ children }) => <>{children}</>);

async function serverRender(
  context: { path: string; initProps: {} },
  staticRouterContext: StaticRouterContext,
) {
  const staticRouterProps: StaticRouterProps = {
    location: context.path,
    basename: entry.route.basename,
  };

  if (["/favicon.ico", "/sockjs-node/info"].includes(context.path)) {
    return <StaticRouter {...staticRouterProps} context={staticRouterContext} />;
  }

  const activityRoute = entry.route.routes.find((routeItem) => {
    return pathToRegexp(routeItem.path, [], { strict: true }).test(context.path);
  });

  if (!activityRoute) {
    warn(`Not found activity route item; path: ${context.path}`);

    return (
      <StaticRouter {...staticRouterProps} context={staticRouterContext}>
        <Root>
          <DefaultNotFound />
        </Root>
      </StaticRouter>
    );
  }

  const ActivityComponent = activityRoute?.component;

  if (!ActivityComponent) {
    const redirectPath = activityRoute.redirect || "/";
    warn(`Not config route component; path: ${context.path}, redirect: ${redirectPath}`);

    staticRouterContext.statusCode = 302;

    return (
      <StaticRouter {...staticRouterProps} context={staticRouterContext}>
        <Root>
          <Redirect from={context.path} to={redirectPath} />
        </Root>
      </StaticRouter>
    );
  }

  let initProps = {};
  if (typeof ActivityComponent.getInitialProps === "function") {
    initProps = await ActivityComponent.getInitialProps();
  }

  context.initProps = initProps;

  return (
    <StaticRouter {...staticRouterProps} context={staticRouterContext}>
      <Root>
        <ActivityComponent {...initProps} />
      </Root>
    </StaticRouter>
  );
}

export default serverRender;
