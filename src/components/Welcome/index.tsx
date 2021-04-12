import React, { FunctionComponent } from "react";

import logo from "./logo.svg";

import styles from "./index.less";

interface WelcomeProps {
  pageName: string;
}

const Welcome: FunctionComponent<WelcomeProps> = ({ pageName }) => (
  <div className={styles["welcome-wrapper"]}>
    <header className="header">
      <h2>
        {pageName}
        &nbsp;page
      </h2>
      <img src={logo} className="logo" alt="logo" />
      <p>
        <span role="img" aria-label="keyboard">
          ⌨️&nbsp;
        </span>
        Edit&nbsp;
        <code>src/components/Welcome/index.tsx</code>
        &nbsp;and save to reload.
      </p>
      <a
        className="link"
        href="https://luban.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span role="img" aria-label="link">
          🔗&nbsp;
        </span>
        Visit more about Luban documentation.
      </a>
    </header>
  </div>
);

export { Welcome };
