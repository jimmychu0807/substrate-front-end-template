import { useContext, useEffect, useCallback } from 'react';
import { ApiPromise, WsProvider } from "@polkadot/api";

import { SubstrateContext } from './SubstrateContext';

const useSubstrate = () => {
  let [state, dispatch] = useContext(SubstrateContext);

  // `useCallback` so that returning memoized function and not created everytime,
  //    and thus re-render.
  const connect = useCallback(async() => {
    let { api, socket, types } = state;
    if (api) return;

    const provider = new WsProvider(socket);

    try {
      api = await ApiPromise.create({ provider, types });
      dispatch({ type: 'CONNECT', payload: api });
      api.isReady.then(() => dispatch({type: 'CONNECT_SUCCESS'}));

    } catch(err) {
      dispatch({ type: 'CONNECT_FAILURE' });
      console.error(err);
    }
  }, [state, dispatch]);

  useEffect(() => {
    connect();
  }, [connect]);

  return { ...state, dispatch };
}

export default useSubstrate;
