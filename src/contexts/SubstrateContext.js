import React, { useReducer } from 'react';

// const DEFAULT_PROVIDER_SOCKET = "wss://dev-node.substrate.dev:9944";
const DEFAULT_PROVIDER_SOCKET = "ws://127.0.0.1:9944";

const reducer = (state, action) => {

  console.log(state, action);

  switch(action.type) {
    case 'RESET_SOCKET':
      let socket = action.payload || state.socket;
      return { ...state,
        socket, api: null, apiReady: false, apiError: false };

    case 'CONNECT':
      return { ...state,
        api: action.payload, apiReady: false, apiError: false };

    case 'CONNECT_SUCCESS':
      return { ...state,
        apiReady: true, apiError: false };

    case 'CONNECT_FAILURE':
      return { ...state,
        apiReady: false, apiError: true };

    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
};

const initState = {
  socket: DEFAULT_PROVIDER_SOCKET,
  api: null,
  apiReady: false,
  apiError: false,
};

const SubstrateContext = React.createContext();

const SubstrateContextProvider = (props) => {

  const [state, dispatch] = useReducer(reducer, initState);

  return (
    <SubstrateContext.Provider value={[state, dispatch]}>
      { props.children }
    </SubstrateContext.Provider>
  );
};

export { SubstrateContext, SubstrateContextProvider };
