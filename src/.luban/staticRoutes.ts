import HOME from "@/pages/home";
import ABOUT from "@/pages/about";
const staticRoute = [{
  path: "/",
  redirect: "/home"
}, {
  name: "home",
  path: "/home",
  component: HOME
}, {
  name: "about",
  path: "/about",
  component: ABOUT
}];
export default staticRoute;