import { Keyring } from "@polkadot/ui-keyring";

export interface Config {
  APP_NAME: string;
  DEVELOPMENT_KEYRING: boolean;
  PROVIDER_SOCKET: string;
  REACT_APP_DEVELOPMENT_KEYRING: boolean;
  REACT_APP_PROVIDER_SOCKET: string;
  RPC: {};
}

export interface State {
  api: any;
  apiError: any;
  apiState: any;
  currentAccount: any;
  keyring: Keyring;
  keyringState: any;
  jsonrpc: {};
  socket: string | string[];
}
