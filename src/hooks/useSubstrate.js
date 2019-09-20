import { useContext, useEffect, useCallback } from 'react';
import { ApiPromise, WsProvider } from "@polkadot/api";

import { SubstrateContext } from '../contexts/SubstrateContext';

const useSubstrate = () => {
  let [state, dispatch] = useContext(SubstrateContext);

  // `useCallback` so that returning memoized function and not created everytime,
  //    and thus re-render.
  const connect = useCallback(async() => {
    let { api, socket } = state;
    if (api) return;

    const provider = new WsProvider(socket);

    // More information on custom types
    // https://github.com/polkadot-js/apps/blob/master/packages/app-settings/src/md/basics.md
    //const TYPES = {"MyNumber": "u32"};
    const TYPES = {};

    try {
      api = await ApiPromise.create({provider, types: TYPES});
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

  return { state, dispatch };
}

export default useSubstrate;
