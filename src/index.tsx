import React from "react";
import { run } from "@/.luban";
import { App } from "./App";
// import { Models, RematchDispatch, RematchRootState } from "@rematch/core";

// import { count } from "./models/count";
import routes from "./routes";

export default run({
  root: "root",
  wrapper: (props) => <App {...props} />,
  route: {
    routes,
  },
  // models: { count },
});

// export interface RootModel extends Models<RootModel> {
//   count: typeof count;
// }
// export type Dispatch = RematchDispatch<RootModel>;
// export type RootState = RematchRootState<RootModel>;
