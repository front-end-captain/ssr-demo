import { hot } from "react-hot-loader/root";
import React from "react";

const __IS_DEV__ = process.env.NODE_ENV === "development";

function defaultWrapper() {
  return <div id="__default_wrapper__" />;
}

/**
 *
 * @param {import('react').ReactElement} wrapper
 */
function createApp(wrapper = defaultWrapper) {
  if (__IS_DEV__) {
    return hot(wrapper);
  }

  return wrapper;
}

export { createApp };
