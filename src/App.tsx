import React, { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";

import "./App.css";

const App: FunctionComponent = (props) => {
  return (
    <div className="app-wrapper">
      <NavLink to="/" activeClassName="activity" exact>
        Index
      </NavLink>
      &nbsp;&nbsp;&nbsp;
      <NavLink to="/home" activeClassName="activity" exact>
        Home
      </NavLink>
      &nbsp;&nbsp;&nbsp;
      <NavLink to="/about" activeClassName="activity" exact>
        About
      </NavLink>
      <div>{props.children}</div>
    </div>
  );
};

export { App };
