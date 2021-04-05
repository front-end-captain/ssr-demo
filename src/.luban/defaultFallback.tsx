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
  console.log("defaultFallback", props);

  return <span style={suspenseFallbackStyle}>loading...</span>;
};
