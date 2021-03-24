/* eslint-disable no-console */
import React from "react";
import { EnhancedRouteComponentProps } from "luban-router/es/definitions";

interface AboutInitProps {
  age: number;
}

class About extends React.Component<EnhancedRouteComponentProps<{ name: string }>, AboutInitProps> {
  static getInitialProps(): AboutInitProps {
    return { age: 1 };
  }

  constructor(props: EnhancedRouteComponentProps<{ name: string }> & AboutInitProps) {
    super(props);

    console.log(props.age);
  }

  render(): JSX.Element {
    console.log(this.props.age);
    return <h4>About page</h4>;
  }
}

export default About ;
