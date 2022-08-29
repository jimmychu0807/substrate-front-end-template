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

// ray test touch <
// TODO: use an enum with TypeScript
const KeyringStatus = Object.freeze({
  Idle:'IDLE',
  Loading: 'LOADING',
  Ready: 'READY',
  Error: 'ERROR'
})
// ray test touch >

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
  keyringState: KeyringStatus.Idle,
  api: null,
  apiError: null,
  apiState: null,
  currentAccount: null,
}

const registry = new TypeRegistry()

///
// Reducer function for `React.useReducer`
const substrateReducer = (state, action) => {
  switch (action.type) {
    case 'CONNECT_INIT':
      return {
        ...state,
        apiState: 'CONNECT_INIT'
      }
    case 'CONNECT':
      return {
        ...state,
        api: action.payload,
        apiState: 'CONNECTING'
      }
    case 'CONNECT_SUCCESS':
      return {
        ...state,
        apiState: 'READY'
      }
    case 'CONNECT_ERROR':
      return {
        ...state,
        apiState: 'ERROR',
        apiError: action.payload
      }
    case 'SET_KEYRING_LOADING':
      return {
        ...state,
        keyringState: KeyringStatus.Loading
      }
    case 'SET_KEYRING_READY':
      return {
        ...state,
        keyring: action.payload,
        keyringState: KeyringStatus.Ready
      }
    case 'SET_KEYRING_ERROR':
      return {
        ...state,
        keyring: null,
        keyringState: KeyringStatus.Error
      }
    case 'SET_CURRENT_ACCOUNT':
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
  const { apiState, socket, jsonrpc } = state
  // We only want this function to be performed once
  if (apiState) return

  dispatch({ type: 'CONNECT_INIT' })

  console.log(`Connected socket: ${socket}`)
  const provider = new WsProvider(socket)
  const _api = new ApiPromise({ provider, rpc: jsonrpc })

  // Set listeners for disconnection and reconnection event.
  _api.on('connected', () => {
    dispatch({ type: 'CONNECT', payload: _api })
    // `ready` event is not emitted upon reconnection and is checked explicitly here.
    _api.isReady.then(_api => dispatch({ type: 'CONNECT_SUCCESS' }))
  })
  _api.on('ready', () => dispatch({ type: 'CONNECT_SUCCESS' }))
  _api.on('error', err => dispatch({ type: 'CONNECT_ERROR', payload: err }))
}

const retrieveChainInfo = async api => {
  const [systemChain, systemChainType] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.chainType
      ? api.rpc.system.chainType()
      : Promise.resolve(registry.createType('ChainType', 'Live')),
  ])

  return {
    systemChain: (systemChain || '<unknown>').toString(),
    systemChainType,
  }
}

///
// Loading accounts from dev and polkadot-js extension
const loadAccounts = (state, dispatch) => {
  const { api } = state
  dispatch({ type: 'SET_KEYRING_LOADING' })

  const asyncLoadAccounts = async () => {
    try {
      await web3Enable(config.APP_NAME)
      let allAccounts = await web3Accounts()

      allAccounts = allAccounts.map(({ address, meta }) => ({
        address,
        meta: { ...meta, name: `${meta.name} (${meta.source})` },
      }))

      // Logics to check if the connecting chain is a dev chain, coming from polkadot-js Apps
      // ref: https://github.com/polkadot-js/apps/blob/15b8004b2791eced0dde425d5dc7231a5f86c682/packages/react-api/src/Api.tsx?_pjax=div%5Bitemtype%3D%22http%3A%2F%2Fschema.org%2FSoftwareSourceCode%22%5D%20%3E%20main#L101-L110
      const { systemChain, systemChainType } = await retrieveChainInfo(api)
      const isDevelopment =
        systemChainType.isDevelopment ||
        systemChainType.isLocal ||
        isTestChain(systemChain)

      Keyring.loadAll({ isDevelopment }, allAccounts)

      dispatch({ type: 'SET_KEYRING_READY', payload: Keyring })
    } catch (e) {
      console.error(e)
      dispatch({ type: 'SET_KEYRING_ERROR' })
    }
  }
  asyncLoadAccounts()
}

const SubstrateContext = React.createContext()

let keyringLoadAll = false

const SubstrateProvider = props => {
  const neededPropNames = ['socket']
  neededPropNames.forEach(key => {
    initialState[key] =
      typeof props[key] === 'undefined' ? initialState[key] : props[key]
  })

  const [state, dispatch] = React.useReducer(substrateReducer, initialState)
  connect(state, dispatch)

  React.useEffect(() => {
    const { apiState, keyringState } = state
    if (apiState === 'READY' && !keyringState && !keyringLoadAll) {
      keyringLoadAll = true
      loadAccounts(state, dispatch)
    }
  }, [state, dispatch])

  function setCurrentAccount(acct) {
    dispatch({ type: 'SET_CURRENT_ACCOUNT', payload: acct })
  }

  return (
    <SubstrateContext.Provider value={{ state, setCurrentAccount }}>
      {props.children}
    </SubstrateContext.Provider>
  )
}

const useSubstrate = () => React.useContext(SubstrateContext)
const useSubstrateState = () => React.useContext(SubstrateContext).state

export {
  SubstrateProvider,
  useSubstrate,
  useSubstrateState
}
