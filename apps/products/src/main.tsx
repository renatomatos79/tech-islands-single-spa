import React from "react";
import ReactDOMClient from "react-dom/client";
import singleSpaReact from "single-spa-react";
import App from "./App";

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: App,
  errorBoundary(error) {
    return <div>{error.message}</div>;
  },
});

export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;

// standalone mode for development - this allows us to run the app independently of single-spa for easier development and testing
if (import.meta.env.DEV) {
  const root = document.getElementById("root")
  console.log("root", root)
  if (root) ReactDOMClient.createRoot(root).render(<App />)
}

