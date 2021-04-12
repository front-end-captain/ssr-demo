import Loadable from "react-loadable";
import { DefaultFallback } from "./defaultFallback";
const dynamicRoute = [{
  path: "/",
  redirect: "/home"
}, {
  name: "home",
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
  name: "about",
  path: "/about",
  component: __IS_BROWSER__ ? Loadable({
    loader: () => import(
    /*webpackChunkName: "page-about"*/
    "@/pages/about"),
    loading: DefaultFallback,
    modules: ["@/pages/about"],
    webpack: () => [require.resolveWeak("@/pages/about")]
  }) : require("@/pages/about").default
}];
export default dynamicRoute;