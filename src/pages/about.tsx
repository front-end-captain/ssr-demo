import React from "react";
import { EnhancedRouteComponentProps } from "@/.luban/"

import { Welcome } from "@/components/Welcome";

class About extends React.Component<EnhancedRouteComponentProps, {}> {
  constructor(props: EnhancedRouteComponentProps) {
    super(props);
  }

  render(): JSX.Element {
    return <Welcome pageName={this.props.name || "About"} />;
  }
}

export default About;
