import { hot } from "react-hot-loader/root";
import React from "react";

import "./app.css";

function App() {
  return <div className="app-wrapper">hello, server side render</div>;
}

export default hot(App);
