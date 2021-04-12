import React from "react";
import { run } from "@/.luban";

import { Nav } from "@/components/Nav";

import routes from "@/routes";

export default run({
  root: "root",
  wrapper: (props) => <Nav {...props} />,
  route: {
    routes,
  },
});
