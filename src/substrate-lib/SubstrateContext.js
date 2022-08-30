import * as React from 'react'
import jsonrpc from '@polkadot/types/interfaces/jsonrpc'
import {
  ApiPromise,
  WsProvider
} from '@polkadot/api'
import {
  web3Accounts,
  web3Enable
} from '@polkadot/extension-dapp'
import { keyring as Keyring } from '@polkadot/ui-keyring'
import { isTestChain } from '@polkadot/util'
import { TypeRegistry } from '@polkadot/types/create'

import config from '../config'

// TODO: use an enum with TypeScript
const KeyringStatus = Object.freeze({
  Idle:'IDLE',
  Loading: 'LOADING',
  Ready: 'READY',
  Error: 'ERROR'
})

// TODO: use an enum with TypeScript
const ApiStatus = Object.freeze({
  Idle: 'IDLE',
  ConnectInit: 'CONNECT_INIT',
  Connecting: 'CONNECTING',
  Ready: 'READY',
  Error: 'ERROR'
})

// TODO: use an enum with TypeScript
const ActionType = Object.freeze({
  ConnectInit: 'CONNECT_INIT',
  Connect: 'CONNECT',
  ConnectSuccess: 'CONNECT_SUCCESS',
  ConnectError: 'CONNECT_ERROR',
  SetKeyringLoading: 'SET_KEYRING_LOADING',
  SetKeyringReady: 'SET_KEYRING_READY',
  SetKeyringError: 'SET_KEYRING_ERROR',
  SetCurrentAccount: 'SET_CURRENT_ACCOUNT'
})

const parsedQuery = new URLSearchParams(window.location.search)
const connectedSocket = parsedQuery.get('rpc') || config.PROVIDER_SOCKET

///
// Initial state for `React.useReducer`
const initialState = {
  // These are the states
  socket: connectedSocket,
  jsonrpc: {
    ...jsonrpc,
    ...config.CUSTOM_RPC_METHODS
  },
  keyring: null,
  keyringStatus: KeyringStatus.Idle,
  api: null,
  apiError: null,
  apiStatus: ApiStatus.Idle,
  currentAccount: null,
}

const registry = new TypeRegistry()

///
// Reducer function for `React.useReducer`
const substrateReducer = (state, action) => {
  switch (action.type) {
    case ActionType.ConnectInit:
      return {
        ...state,
        apiStatus: ApiStatus.ConnectInit
      }
    case ActionType.Connect:
      return {
        ...state,
        api: action.payload,
        apiStatus: ApiStatus.Connecting
      }
    case ActionType.ConnectSuccess:
      return {
        ...state,
        apiStatus: ApiStatus.Ready
      }
    case ActionType.ConnectError:
      return {
        ...state,
        apiStatus: ApiStatus.Error,
        apiError: action.payload
      }
    case ActionType.SetKeyringLoading:
      return {
        ...state,
        keyringStatus: KeyringStatus.Loading
      }
    case ActionType.SetKeyringReady:
      return {
        ...state,
        keyring: action.payload,
        keyringStatus: KeyringStatus.Ready
      }
    case ActionType.SetKeyringError:
      return {
        ...state,
        keyring: null,
        keyringStatus: KeyringStatus.Error
      }
    case ActionType.SetCurrentAccount:
      return {
        ...state,
        currentAccount: action.payload
      }
    default:
      throw new Error(`Unknown type: ${action.type}`)
  }
}

///
// Connecting to the Substrate node
const connect = (state, dispatch) => {
  const {
    socket,
    jsonrpc
  } = state

  dispatch({ type: ActionType.ConnectInit })

  console.log(`Connected socket: ${socket}`)

  const provider = new WsProvider(socket)
  const _api = new ApiPromise({
    provider,
    rpc: jsonrpc
  })

  // Set listeners for disconnection and reconnection event.
  _api.on('connected', () => {
    dispatch({
      type: ActionType.Connect,
      payload: _api
    })
    // `ready` event is not emitted upon reconnection and is checked explicitly here.
    _api.isReady.then(_api => {
      dispatch({ type: ActionType.ConnectSuccess })
      // ray test touch <
      // Keyring accounts were not being loaded properly because the `api` needs to first load
      // the WASM file used for `sr25519`. Loading accounts at this point follows the recommended pattern:
      // https://polkadot.js.org/docs/ui-keyring/start/init/#using-with-the-api
      loadAccounts(state, dispatch);
      // ray test touch >
    })
  })
  _api.on('ready', () => dispatch({ type: ActionType.ConnectSuccess }))
  _api.on('error', error => dispatch({
    type: ActionType.ConnectError,
    payload: error
  }))
}

// ray test touch <
const retrieveChainInfo = async api => {
  const [
    systemChain,
    systemChainType
  ] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.chainType
      ? api.rpc.system.chainType()
      : Promise.resolve(registry.createType('ChainType', 'Live'))
  ])

  return {
    systemChain: (systemChain || '<unknown>').toString(),
    systemChainType
  }
}
// ray test touch >

///
// Loading accounts from dev and polkadot-js extension
const loadAccounts = async (state, dispatch) => {
  dispatch({ type: ActionType.SetKeyringLoading })

  try {
    await web3Enable(config.APP_NAME)

    let allAccounts = await web3Accounts()
    allAccounts = allAccounts.map(({
      address,
      meta
    }) => ({
      address,
      meta: {
        ...meta,
        name: `${meta.name} (${meta.source})`
      }
    }))

    // ray test touch <
    // Logics to check if the connecting chain is a dev chain, coming from polkadot-js Apps
    // ref: https://github.com/polkadot-js/apps/blob/15b8004b2791eced0dde425d5dc7231a5f86c682/packages/react-api/src/Api.tsx?_pjax=div%5Bitemtype%3D%22http%3A%2F%2Fschema.org%2FSoftwareSourceCode%22%5D%20%3E%20main#L101-L110
    const { systemChain, systemChainType } = await retrieveChainInfo(state.api)
    const isDevelopment =
      systemChainType.isDevelopment ||
      systemChainType.isLocal ||
      isTestChain(systemChain)
    // ray test touch >

    Keyring.loadAll({ isDevelopment }, allAccounts)

    dispatch({
      type: ActionType.SetKeyringReady,
      payload: Keyring
    })
  } catch (error) {
    console.error('[loadAccounts] error.message => ', error.message);
    dispatch({ type: ActionType.SetKeyringError })
  }
}

const SubstrateStateContext = React.createContext()

const SubstrateProvider = ({
  children,
  socket
}) => {
  const [state, dispatch] = React.useReducer(substrateReducer, {
    ...initialState,
    // Filtering props and merge with default param value
    socket: socket ?? initialState.socket
  })

  // ray test touch <
  const stateRef = React.useRef(state);
  // MEMO: inspired by https://epicreact.dev/the-latest-ref-pattern-in-react/
  React.useLayoutEffect(() => {
    stateRef.current = state;
  });
  React.useEffect(() => {
    connect(stateRef.current, dispatch);
  }, []);
  // ray test touch >

  // ray test touch <
  function setCurrentAccount(newAccount) {
    dispatch({ type: ActionType.SetCurrentAccount, payload: newAccount })
  }

  const value = {
    state,
    setCurrentAccount
  }
  // ray test touch >

  return (
    <SubstrateStateContext.Provider value={value}>
      {children}
    </SubstrateStateContext.Provider>
  )
}

// ray test touch <
const useSubstrate = () => {
  const context = React.useContext(SubstrateStateContext);
  if (context === undefined) {
    throw new Error('useSubstrate must be used within a SubstrateProvider!');
  }
  return context;
}
const useSubstrateState = () => useSubstrate().state // TODO: it could be redundant in favor of useSubstrate
// ray test touch >

export {
  SubstrateProvider,
  useSubstrate,
  useSubstrateState,
  // ray test touch <
  ApiStatus,
  KeyringStatus,
  ActionType
  // ray test touch >
}
