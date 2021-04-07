import HOME from "@/pages/home";
import ABOUT from "@/pages/about";
import INDEX from "@/pages/index";
const staticRoute = [{
  path: "/",
  redirect: "/index"
}, {
  path: "/home",
  component: HOME
}, {
  path: "/about",
  component: ABOUT
}, {
  path: "/index",
  component: INDEX
}, {
  path: "/brendan",
  redirect: "/about"
}];
export default staticRoute;