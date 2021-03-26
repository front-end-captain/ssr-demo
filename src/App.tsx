import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";

import "./App.css";

const App: FunctionComponent = (props) => {
  return (
    <div className="app-wrapper">
      <Link to="/">Index</Link>
      &nbsp;&nbsp;&nbsp;
      <Link to="/home">Home</Link>
      &nbsp;&nbsp;&nbsp;
      <Link to="/about">About</Link>
      <div>{props.children}</div>
    </div>
  );
};

export { App };
