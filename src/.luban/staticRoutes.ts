import HOME from "@/pages/home";
import ABOUT from "@/pages/about";
const staticRoute = [{
  path: "/",
  redirect: "/home"
}, {
  name: "Home",
  path: "/home",
  component: HOME
}, {
  name: "About",
  path: "/about",
  component: ABOUT
}];
export default staticRoute;