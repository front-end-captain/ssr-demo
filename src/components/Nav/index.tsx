import React, { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";

import styles from "./index.less";

const Nav: FunctionComponent = (props) => {
  return (
    <div className={styles["app-wrapper"]}>
      <div className="nav-wrapper">
        <NavLink to="/home" activeClassName="activity" exact>
          Home
        </NavLink>
        &nbsp;&nbsp;&nbsp;
        <NavLink to="/about" activeClassName="activity" exact>
          About
        </NavLink>
      </div>

      <div>{props.children}</div>
    </div>
  );
};

export { Nav };
