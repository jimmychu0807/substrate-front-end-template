import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { SubstrateContextProvider } from "./substrate/SubstrateContext";

ReactDOM.render(
  // More information on custom types: http://bit.ly/2kHYvLc
  <SubstrateContextProvider
    socket="wss://dev-node.substrate.dev:9944"
    types={{}}>
    <App />
  </SubstrateContextProvider>,
  document.getElementById("root")
);
