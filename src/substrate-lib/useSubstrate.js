import { useContext, useEffect, useCallback } from 'react';
import { ApiPromise, WsProvider } from "@polkadot/api";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import keyring from "@polkadot/ui-keyring";

import config from "../config";
import { SubstrateContext } from './SubstrateContext';

const useSubstrate = () => {
  let [state, dispatch] = useContext(SubstrateContext);

  // `useCallback` so that returning memoized function and not created
  //   everytime, and thus re-render.
  const connect = useCallback(async() => {
    let { api, socket, types } = state;
    if (api) return;

    const provider = new WsProvider(socket);

    try {
      api = await ApiPromise.create({ provider, types });
      dispatch({ type: 'CONNECT', payload: api });
      api.isReady.then(() => dispatch({type: 'CONNECT_SUCCESS'}));

    } catch(e) {
      console.log(e);
      dispatch({ type: 'CONNECT_ERROR' });
    }
    // eslint-disable-next-line
  }, [state.api, state.socket]);

  // hook to get injected accounts
  const loadAccounts = useCallback(async() => {

    // Ensure the method only run once.
    if (state.keyringState) return;

    try {
      await web3Enable(config.APP_NAME);
      let allAccounts = await web3Accounts();
      allAccounts = allAccounts.map(({ address, meta }) =>
        ({ address, meta: { ...meta, name: `${meta.name} (${meta.source})` }}));

      keyring.loadAll({ isDevelopment: config.DEVELOPMENT_KEYRING }, allAccounts);
      dispatch({ type: 'SET_KEYRING', payload: keyring });
    } catch (e) {
      console.log(e);
      dispatch({ type: 'KEYRING_ERROR' });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  return { ...state, dispatch };
}

export default useSubstrate;
