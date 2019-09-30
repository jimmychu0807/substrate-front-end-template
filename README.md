# Substrate Front End Template

## Purpose

The purpose of this front-end template is to allow you to quickly create a
frontend app that connect to a [Substrate](https://github.com/paritytech/substrate)
node without much configuration and simplify the underlying connection and
handling of [Polkadot-JS](https://polkadot.js.org/api/).

The encapsulation is handled by components inside `substrate-lib`. Substrate
connection information is exposed out via `substrate-lib/useSubstrate.js`
[custom hook](https://reactjs.org/docs/hooks-custom.html).

## Configuration

The app configuration can be set in `src/config` folder, with
[common.json](./src/config/common.json)
loaded in both development and production environment, and then the environment
specific JSON file (with higher priority). More on React enviornment variables
can be seen [here](https://create-react-app.dev/docs/adding-custom-environment-variables).

When writing and deploying an app with your own node, you likely want to change:

  - `CUSTOM_TYPES` in `src/config/common.json`. See
  [Extending types](https://polkadot.js.org/api/start/types.extend.html).

  - `PROVIDER_SOCKET` in `src/config/production.json` pointing to your own
  deployed node.

  - `DEVELOPMENT_KEYRING` in `src/config/common.json` be set to `false`.
  See [Keyring](https://polkadot.js.org/api/start/keyring.html).


## Install and Start
```bash
cd ./substrate-front-end-template
yarn install
yarn start
```

## Some Details

### useSubstrate

The `useSubstrate` custom hook exposes this object:

```js
{
  socket,
  types,
  keyring,
  keyringState,
  api,
  apiState,
}
```

  - `socket` - the remote provider socket it is connecting to
  - `types` - the custom type used in the connected node
  - `keyring` - keyring of the connected node
  - `keyringState` - one of [`READY`, `ERROR`] states. `keyring` is valid
  only when `keyringState` === `READY`.
  - `api` - the remote api to the connected node
  - `apiState` - one of [`CONNECTING`, `READY`, `ERROR`] states. `api` is valid
  only when `apiState` === `READY`.


### TxButton Component

There is a `TxButton` component in
[src/substrate-lib/components/TxButton.js](./src/substrate-lib/components/TxButton.js).
It handles a basic [query](https://polkadot.js.org/api/start/api.query.html)
and [transaction](https://polkadot.js.org/api/start/api.tx.html) request to the
connected node, and app developers could reuse this component by passing the
right parameters in. See [src/Transfer.js](./src/Transfer.js) for a transaction
example and [src/ChainState.js](./src/ChainState.js) for a query example.
