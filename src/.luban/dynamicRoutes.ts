import Loadable from "react-loadable";
import { defaultFallback } from "./defaultFallback";
const dynamicRoute = [{
  path: "/",
  redirect: "/index"
}, {
  path: "/home",
  component: Loadable({
    loader: () => import(
    /*webpackChunkName: "page-home"*/
    "@/pages/home"),
    loading: defaultFallback,
    modules: ["@/pages/home"],
    webpack: () => [require.resolveWeak("@/pages/home")]
  })
}, {
  path: "/about",
  component: Loadable({
    loader: () => import(
    /*webpackChunkName: "page-about"*/
    "@/pages/about"),
    loading: defaultFallback,
    modules: ["@/pages/about"],
    webpack: () => [require.resolveWeak("@/pages/about")]
  })
}, {
  path: "/index",
  component: Loadable({
    loader: () => import(
    /*webpackChunkName: "page-index"*/
    "@/pages/index"),
    loading: defaultFallback,
    modules: ["@/pages/index"],
    webpack: () => [require.resolveWeak("@/pages/index")]
  })
}, {
  path: "/brendan",
  redirect: "/about"
}];
export default dynamicRoute;