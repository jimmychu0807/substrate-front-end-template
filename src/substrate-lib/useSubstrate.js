import { useContext, useEffect, useCallback } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import keyring from '@polkadot/ui-keyring';

import config from '../config';
import { SubstrateContext } from './SubstrateContext';

const useSubstrate = () => {
  const [state, dispatch] = useContext(SubstrateContext);

  // `useCallback` so that returning memoized function and not created
  //   everytime, and thus re-render.
  const { api, socket, types } = state;
  const connect = useCallback(async () => {
    if (api) return;

    const provider = new WsProvider(socket);
    const _api = new ApiPromise({ provider, types });

    // We want to listen to event for disconnection and reconnection.
    //  That's why we set for listeners.
    _api.on('connected', () => {
      dispatch({ type: 'CONNECT', payload: _api });
      // `ready` event is not emitted upon reconnection. So we check explicitly here.
      _api.isReady.then((_api) => dispatch({ type: 'CONNECT_SUCCESS' }));
    });
    _api.on('ready', () => dispatch({ type: 'CONNECT_SUCCESS' }));
    _api.on('error', () => dispatch({ type: 'CONNECT_ERROR' }));
  }, [api, socket, types, dispatch]);

  // hook to get injected accounts
  const { keyringState } = state;
  const loadAccounts = useCallback(async () => {
    // Ensure the method only run once.
    if (keyringState) return;

    try {
      await web3Enable(config.APP_NAME);
      let allAccounts = await web3Accounts();
      allAccounts = allAccounts.map(({ address, meta }) =>
        ({ address, meta: { ...meta, name: `${meta.name} (${meta.source})` } }));

      keyring.loadAll({ isDevelopment: config.DEVELOPMENT_KEYRING }, allAccounts);
      dispatch({ type: 'SET_KEYRING', payload: keyring });
    } catch (e) {
      console.error(e);
      dispatch({ type: 'KEYRING_ERROR' });
    }
  }, [keyringState, dispatch]);

  useEffect(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  return { ...state, dispatch };
};

export default useSubstrate;
