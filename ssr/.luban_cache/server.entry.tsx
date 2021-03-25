import React from "react";
import { StaticRouter } from "react-router-dom";
import { pathToRegexp } from "path-to-regexp";

import entry from "../";

const Root = entry.provider;

async function serverRender(context: { path: string, initProps: {} }) {
  const activityRoute = entry.routes.find((routeItem) => {
    return pathToRegexp(routeItem.path, [], { strict: true }).test(context.path);
  });

  if (!activityRoute) {
    return null;
  }

  const ActivityComponent = activityRoute.component || (() => null);

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
