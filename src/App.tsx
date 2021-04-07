import React, { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";
import Helmet from "react-helmet";

import "./App.css";

const App: FunctionComponent = (props) => {
  return (
    <div className="app-wrapper">
      <Helmet>
        <meta name="description" content="this is description" />
        <meta name="description" content="this is another description" />
      </Helmet>
      <NavLink to="/index" activeClassName="activity" exact>
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
