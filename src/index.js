import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { SubstrateContextProvider } from "./substrate-lib";

ReactDOM.render(
  // More information on custom types: http://bit.ly/2kHYvLc
  <SubstrateContextProvider>
    <App />
  </SubstrateContextProvider>,
  document.getElementById("root")
);
