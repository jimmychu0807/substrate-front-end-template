import React, { useReducer } from 'react';
import PropTypes from 'prop-types';

const DEFAULT_PROVIDER_SOCKET = "ws://127.0.0.1:9944";
const DEFAULT_TYPES = {};
const INIT_STATE = {
  socket: DEFAULT_PROVIDER_SOCKET,
  types: DEFAULT_TYPES,
  api: null,
  apiReady: false,
  apiError: false,
};

const reducer = (state, action) => {

  console.log("action dispatched", action, state);

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

const SubstrateContext = React.createContext();

const SubstrateContextProvider = (props) => {
  // filtering props and merge with default param value
  let initState = { ...INIT_STATE };
  const neededProps = ["socket", "types"];
  neededProps.forEach(key => {
    initState[key] = (typeof props[key] === 'undefined' ? initState[key] : props[key]);
  });

  const [state, dispatch] = useReducer(reducer, { ...INIT_STATE, ...props });

  return (
    <SubstrateContext.Provider value={[state, dispatch]}>
      { props.children }
    </SubstrateContext.Provider>
  );
};

// prop typechecking
SubstrateContextProvider.propTypes = {
  socket: PropTypes.string,
  types: PropTypes.object,
};

export { SubstrateContext, SubstrateContextProvider };
