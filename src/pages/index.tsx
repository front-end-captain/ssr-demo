import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, Dispatch } from "@/index";
import { Page } from "@/.luban";

import { RouteComponentProps } from "react-router-dom";

interface IndexInitProps {
  initCount: number;
}

const Index: Page<RouteComponentProps<{ name: string }>, IndexInitProps> = ({ initCount }) => {
  const count = useSelector((state: RootState) => {
    return state.count;
  });

  const dispatch = useDispatch<Dispatch>();

  return (
    <div>
      <h3>Index Page</h3>
      <h4>{initCount}</h4>
      <h4>{count.count}</h4>
      <h4>{count.name}</h4>
      <h4>{count.age}</h4>
      <button onClick={() => dispatch.count.increment(1)}>increment</button>
      <button onClick={() => dispatch.count.incrementAsync(1)}>incrementAsync</button>
    </div>
  );
};

Index.getInitialProps = function(context) {
  context.store.dispatch.count.increment(1);

  return { initCount: context.store.getState().count.count };
};

export default Index;
