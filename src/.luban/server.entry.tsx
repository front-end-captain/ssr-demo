import React from "react";
import { StaticRouter } from "react-router-dom";
import { pathToRegexp } from "path-to-regexp";

import entry from "../";

const Root = entry.provider;

async function serverRender(context: { path: string; initProps: {} }) {
  const activityRoute = entry.routes.find((routeItem) => {
    if (routeItem.component) {
      return pathToRegexp(routeItem.path, [], { strict: true }).test(context.path);
    }

    if (routeItem.redirect) {
      return pathToRegexp(routeItem.redirect, [], { strict: true }).test(context.path);
    }

    return null;
  });

  if (!activityRoute) {
    return (
      <StaticRouter location={context.path}>
        <Root>{null}</Root>
      </StaticRouter>
    );
  }

  const ActivityComponent = activityRoute.component;

  if (!ActivityComponent) {
    return null;
  }

  let initProps = {};
  if (typeof ActivityComponent.getInitialProps === "function") {
    initProps = await ActivityComponent.getInitialProps();
  }

  context.initProps = initProps;

  return (
    <StaticRouter location={context.path} context={initProps}>
      <Root>
        <ActivityComponent {...initProps} />
      </Root>
    </StaticRouter>
  );
}

export default serverRender;
