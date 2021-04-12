import React from "react";
import { RouteComponentProps } from "react-router-dom";

interface AboutInitProps {
  my_name: string;
}

interface AboutInitState {
  count: number;
}

class About extends React.Component<
  RouteComponentProps<{ name: string }>,
  AboutInitState,
  AboutInitProps
> {
  constructor(props: RouteComponentProps<{ name: string }> & AboutInitProps) {
    super(props);

    this.state = {
      count: 1,
    };
  }

  handleCount = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render(): JSX.Element {
    const { count } = this.state;
    return (
      <div>
        <h3>About page, {this.props.my_name}</h3>
        <h4>{count}</h4>
        <button onClick={this.handleCount}>click me</button>
      </div>
    );
  }
}

export default About;
