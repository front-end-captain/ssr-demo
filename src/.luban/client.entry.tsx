import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import { GetInitialProps } from "./getInitialProps";

import entry from "../";

const Root = entry.provider;
const root = document.getElementById(entry.root);

function App() {
  const router = entry.routes.map((item) => {
    const render = () => {
      return item.component ? GetInitialProps(item.component) : <Redirect to={{ pathname: item.redirect }} />;
    };

    return <Route path={item.path} key={item.path} render={render} extra />;
  });

  return (
    <BrowserRouter>
      <Root>
        <Switch>{router}</Switch>
      </Root>
    </BrowserRouter>
  );
}

function clientRender() {
  ReactDOM[window.__USE_SSR__ ? "hydrate" : "render"](<App />, root);

  if (module.hot) {
    module.hot.accept();
  }
}

clientRender();
