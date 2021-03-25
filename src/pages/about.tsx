import React from "react";
import { RouteComponentProps } from "react-router-dom";

interface AboutInitProps {
  my_name: string;
}

class About extends React.Component<RouteComponentProps<{ name: string }>, AboutInitProps> {
  static getInitialProps(): Promise<AboutInitProps> {
    return new Promise<AboutInitProps>((resolve) => {
      setTimeout(() => {
        resolve({ my_name: "brendan" });
      }, 1000);
    });
  }

  constructor(props: RouteComponentProps<{ name: string }> & AboutInitProps) {
    super(props);
  }

  render(): JSX.Element {
    return <h3>About page, {this.props.my_name}</h3>;
  }
}

export default About;
