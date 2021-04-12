import HOME from "@/pages/home";
import ABOUT from "@/pages/about";
const staticRoute = [{
  path: "/",
  redirect: "/home"
}, {
  path: "/home",
  component: HOME
}, {
  path: "/about",
  component: ABOUT
}];
export default staticRoute;