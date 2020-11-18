import React from "react";
import ReactDOM, { render } from "react-dom";

import App from "./app";

const root = document.getElementById("root");

render(<App />, root);

ReactDOM.render(<App />, root);

// module.hot? render(<App />, root) : hydrate(<App />, root);