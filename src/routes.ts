import { routes } from "@/.luban";

export default routes([
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    component: "@/pages/home",
  },
  {
    path: "/about",
    component: "@/pages/about",
  },
]);
