import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import config from '../config';

const INIT_STATE = {
  socket: config.PROVIDER_SOCKET,
  types: config.CUSTOM_TYPES,
  keyring: null,
  keyringState: null,
  api: null,
  apiState: null
};

const reducer = (state, action) => {
  let socket = null;

  switch (action.type) {
    case 'RESET_SOCKET':
      socket = action.payload || state.socket;
      return { ...state, socket, api: null, apiState: null };

    case 'CONNECT':
      return { ...state, api: action.payload, apiState: 'CONNECTING' };

    case 'CONNECT_SUCCESS':
      return { ...state, apiState: 'READY' };

    case 'CONNECT_ERROR':
      return { ...state, apiState: 'ERROR' };

    case 'SET_KEYRING':
      return { ...state, keyring: action.payload, keyringState: 'READY' };

    case 'KEYRING_ERROR':
      return { ...state, keyring: null, keyringState: 'ERROR' };

    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
};

const SubstrateContext = React.createContext();

const SubstrateContextProvider = (props) => {
  // filtering props and merge with default param value
  const initState = { ...INIT_STATE };
  const neededPropNames = ['socket', 'types'];
  neededPropNames.forEach(key => {
    initState[key] = (typeof props[key] === 'undefined' ? initState[key] : props[key]);
  });
  const [state, dispatch] = useReducer(reducer, initState);

  return (
    <SubstrateContext.Provider value={[state, dispatch]}>
      {props.children}
    </SubstrateContext.Provider>
  );
};

// prop typechecking
SubstrateContextProvider.propTypes = {
  socket: PropTypes.string,
  types: PropTypes.object
};

export { SubstrateContext, SubstrateContextProvider };
