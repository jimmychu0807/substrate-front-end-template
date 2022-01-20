// This component will simply add utility functions to your developer console.
import { useSubstrate } from '../';

export default function DeveloperConsole (props) {
  const { api, apiState, keyring, keyringState } = useSubstrate();
  const windowRef = window as any;

  if (apiState === 'READY')  { 
    windowRef.api = api; 
  }
  
  if (keyringState === 'READY') { 
    windowRef.keyring = keyring; 
  }
  windowRef.util = require('@polkadot/util');
  windowRef.utilCrypto = require('@polkadot/util-crypto');

  return null;
}
