import React from "react";
import { StaticRouter } from "react-router-dom";
import { pathToRegexp } from "path-to-regexp";

console.log("__IS_BROWSER__", __IS_BROWSER__);

import entry from "../";

function serverRender(path: string) {
  const activityRoute = entry.routes.routes.find((routeItem) => {
    return pathToRegexp(routeItem.path, [], { strict: true }).test(path);
  });

  if (!activityRoute) {
    return null;
  }

  // if (typeof activityRoute.component.getInitialProps === "function") {

  // }

  const ActivityComponent = activityRoute.component || (() => null);

  return (
    <StaticRouter location={path}>
      <ActivityComponent />
    </StaticRouter>
  );
}

export default serverRender;
