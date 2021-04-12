import { routes } from "@/.luban";

export default routes([
  {
    path: "/",
    redirect: "/home",
  },
  {
    name: "home", 
    path: "/home",
    component: "@/pages/home",
  },
  {
    name: "about", 
    path: "/about",
    component: "@/pages/about",
  },
]);
