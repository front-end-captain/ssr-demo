import React, { Component } from "react";
import { ComponentType } from "luban-ssr";
import { DefaultRouteProps } from "./router/definitions";

interface MountPropsComponentState {
  extraProps: Record<string, unknown>;
}

interface MountPropsComponent extends Component<DefaultRouteProps, MountPropsComponentState, {}> {
  getInitialProps: () => Promise<void>;
}

let mountPropsComponent: MountPropsComponent | null = null;
let routerChanged = false;

function handlePopState() {
  routerChanged = true;

  if (!location.hash && mountPropsComponent && mountPropsComponent.getInitialProps) {
    mountPropsComponent.getInitialProps();
  }
}

export function mountProps(
  WrappedComponent: ComponentType,
): React.ComponentClass<DefaultRouteProps, MountPropsComponentState> {
  class MountPropsInnerComponent
    extends Component<DefaultRouteProps, MountPropsComponentState, {}>
    implements MountPropsComponent {
    constructor(props: DefaultRouteProps) {
      super(props);

      this.state = {
        extraProps: {},
      };

      if (!routerChanged) {
        routerChanged = !window.__USE_SSR__ || (props.history && props.history.action === "PUSH");
      }

      if (window.__USE_SSR__) {
        mountPropsComponent = this;
        window.addEventListener("popstate", handlePopState);
      }
    }

    async componentDidMount() {
      if ((this.props.history && this.props.history.action !== "POP") || !window.__USE_SSR__) {
        await this.getInitialProps();
      }
    }

    async getInitialProps() {
      const extraProps = WrappedComponent.getInitialProps
        ? await WrappedComponent.getInitialProps()
        : {};

      this.setState({
        extraProps,
      });
    }

    render() {
      const { extraProps } = this.state;

      const initData = routerChanged ? {} : window.__INITIAL_DATA__;
      const finalProps = { ...this.props, ...initData, ...extraProps };

      return <WrappedComponent {...finalProps} />;
    }
  }

  return MountPropsInnerComponent;
}
