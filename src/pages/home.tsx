import React from "react";
import { EnhancedRouteComponentProps } from "@/.luban/";
import { Page } from "@/.luban";

import { Welcome } from "@/components/Welcome";

const Home: Page<EnhancedRouteComponentProps> = ({ name }) => {
  return <Welcome pageName={name || "Home"} />;
};

export default Home;
