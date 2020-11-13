import React from "react";
import ReactDOM from "react-dom";

import { createApp } from "./createApp";

const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate;

/**
 *
 * @param {{ mount: string, wrappers: import('react').ReactElement  }} options
 */
function run(options = {}) {
  const App = createApp(options.wrapper);

  const root = document.getElementById(options.mount);

  renderMethod(<App />, root);
}

export { run };
