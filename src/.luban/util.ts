import { ComponentType } from "react";
import Loadable, { LoadingComponentProps } from "react-loadable";
import { NestedRouteItem, Role, OriginNestedRouteItem, BasicRouterItem } from "./definitions";

import { defaultFallback } from "./defaultFallback";

function checkAuthority(role: Role, authority?: Array<string | number>): boolean {
  if (typeof authority === "undefined") {
    return true;
  }

  if (Array.isArray(role)) {
    const roleSet = new Set(role);
    return authority.filter((item) => roleSet.has(item)).length > 0;
  }

  return authority.includes(role);
}

function filterUnPermissionRoute(
  routes: Array<NestedRouteItem>,
  role: Role,
): Array<NestedRouteItem> {
  return routes.filter((route) => {
    if (route.path.includes("404")) {
      return false;
    }

    if (Array.isArray(route.children) && route.children.length > 0) {
      // eslint-disable-next-line no-param-reassign
      route.children = filterUnPermissionRoute(route.children, role);
    }

    return checkAuthority(role, route.authority);
  });
}

function flattenRoutes(
  routes: Array<OriginNestedRouteItem>,
  fallback?: ComponentType<LoadingComponentProps>,
): Array<BasicRouterItem> {
  let routeList: Array<BasicRouterItem> = [];

  routes.forEach((route) => {
    // console.log(route);
    const path = route.component ? route.component.replace("@", "..") : undefined;

    console.log("path", path);

    routeList.push({
      ...route,
      component: path
        ? Loadable({
            // loader: () => import(`${path}`),
            loader: () => import("@/pages/index"),
            loading: fallback || defaultFallback,
            modules: [path],
            webpack: () => [require.resolveWebpack(path)],
          })
        : undefined,
    });

    if (Array.isArray(route.children) && route.children.length > 0) {
      routeList = routeList.concat(flattenRoutes(route.children, fallback));
    }
  });

  console.log("routeList", routeList);

  return routeList;
}

export { flattenRoutes, checkAuthority, filterUnPermissionRoute };
