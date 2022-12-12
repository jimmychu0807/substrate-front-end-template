// This component will simply add utility functions to your developer console.
import { useSubstrateState } from '../'

export default function DeveloperConsole(props) {
  const { api, apiStatus, keyring, keyringStatus } = useSubstrateState()
  if (apiStatus === 'READY') {
    window.api = api
  }
  if (keyringStatus === 'READY') {
    window.keyring = keyring
  }
  window.util = require('@polkadot/util')
  window.utilCrypto = require('@polkadot/util-crypto')

  return null
}
