import React from "react";
import App from "./app";


export default {
  root: "root",
  provider: (props = {}) => {
    return <App>{props.children}</App>;
  },
  routes: [],
};
