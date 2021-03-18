import React from "react";
import { render, hydrate } from "react-dom";

import entry from ".";

console.log("__IS_BROWSER__", __IS_BROWSER__);

const Root = entry.provider;
const root = document.getElementById(entry.root);

module.hot? render(<Root />, root) : hydrate(<Root />, root);
