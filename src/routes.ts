import { routes } from "@/.luban";

export default routes([
  {
    path: "/",
    redirect: "/home",
  },
  {
    name: "Home", 
    path: "/home",
    component: "@/pages/home",
  },
  {
    name: "About", 
    path: "/about",
    component: "@/pages/about",
  },
]);
