import React from "react";
import { run } from "@/.luban";

import { App } from "./App";

import routes from "./routes";

export default run({
  root: "root",
  wrapper: (props) => <App {...props} />,
  route: {
    routes,
  },
});
