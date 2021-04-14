/**
 * DO NOT MOVE THIS FILE ELSEWHERE
 */

import { route } from "@/.luban";

export default route({
  // fallback: "@/components/Fallback",
  routes: [
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
  ],
});
