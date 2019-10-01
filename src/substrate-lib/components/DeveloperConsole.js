// This component will simply add utility functions to your developer console.
import { useSubstrate } from '../';

export default function DeveloperConsole (props) {
  const { api } = useSubstrate();
  window.api = api;
  window.util = require('@polkadot/util');
  window.util_crypto = require('@polkadot/util-crypto');
  window.keyring = require('@polkadot/keyring');

  return null;
}
