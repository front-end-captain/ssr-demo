import React from "react";
import { render, hydrate } from "react-dom";
import App from "./app";

const root = document.getElementById("root");

module.hot? render(<App />, root) : hydrate(<App />, root);
