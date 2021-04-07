import React, { CSSProperties } from "react";
import { LoadingComponentProps } from "react-loadable";

const suspenseFallbackStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "0.4rem",
  color: "#ccc",
};

export const defaultFallback = (props: LoadingComponentProps) => {
  if (props.error) {
    return (
      <div>
        Error! <button onClick={props.retry}>Retry</button>
      </div>
    );
  } else if (props.timedOut) {
    return (
      <div>
        Taking a long time... <button onClick={props.retry}>Retry</button>
      </div>
    );
  } else if (props.pastDelay) {
    return <div style={suspenseFallbackStyle}>loading...</div>;
  } else {
    return <div>loading...</div>;
  }
};
