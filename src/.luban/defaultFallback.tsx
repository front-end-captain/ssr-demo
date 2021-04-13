import React, { CSSProperties, FunctionComponent } from "react";
import { LoadingComponentProps } from "react-loadable";

const suspenseFallbackStyle: CSSProperties = {
  width: "100%",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "2rem",
  color: "#ccc",
};

export const defaultLoadingProps: LoadingComponentProps = {
  isLoading: false,
  error: null,
  timedOut: false,
  pastDelay: false,
  retry: () => undefined,
};

export const DefaultFallback: FunctionComponent<LoadingComponentProps> = (props) => {
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
    return null;
  }
};
