import Loadable from "react-loadable";
import { DefaultFallback } from "./defaultFallback";
const dynamicRoute = [{
  path: "/",
  redirect: "/index"
}, {
  path: "/home",
  component: __IS_BROWSER__ ? Loadable({
    loader: () => import(
    /*webpackChunkName: "page-home"*/
    "@/pages/home"),
    loading: DefaultFallback,
    modules: ["@/pages/home"],
    webpack: () => [require.resolveWeak("@/pages/home")]
  }) : require("@/pages/home").default
}, {
  path: "/about",
  component: __IS_BROWSER__ ? Loadable({
    loader: () => import(
    /*webpackChunkName: "page-about"*/
    "@/pages/about"),
    loading: DefaultFallback,
    modules: ["@/pages/about"],
    webpack: () => [require.resolveWeak("@/pages/about")]
  }) : require("@/pages/about").default
}, {
  path: "/index",
  component: __IS_BROWSER__ ? Loadable({
    loader: () => import(
    /*webpackChunkName: "page-index"*/
    "@/pages/index"),
    loading: DefaultFallback,
    modules: ["@/pages/index"],
    webpack: () => [require.resolveWeak("@/pages/index")]
  }) : require("@/pages/index").default
}, {
  path: "/brendan",
  redirect: "/about"
}];
export default dynamicRoute;