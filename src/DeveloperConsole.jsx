// This component will simply add utility functions to your developer console.

export default function Metadata(props) {
  const { api } = props;

  let util = require("@polkadot/util");
  let util_crypto = require("@polkadot/util-crypto");
  let keyring = require("@polkadot/keyring");

  window.api = api;
  window.util = util;
  window.util_crypto = util_crypto;
  window.keyring = keyring;

  return null;
}
