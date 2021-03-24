import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";

import "./App.css";

const App: FunctionComponent = (props) => {
  return (
    <div className="app-wrapper">
      <Link to="/home">首页</Link> <Link to="/about">关于</Link>
      <div>{props.children}</div>
    </div>
  );
};

export { App };
