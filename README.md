# Substrate Front End Template

## Purpose

The purpose of this front-end template is to allow you to quickly create a
front-end application that connects to a [Substrate](https://github.com/paritytech/substrate)
node without much configuration and simplify the underlying connection and
handling of [Polkadot-JS](https://polkadot.js.org/api/).

The encapsulation is handled by components inside `substrate-lib`. Substrate
connection information is exposed out via `substrate-lib/useSubstrate.js`
[custom hook](https://reactjs.org/docs/hooks-custom.html).

## Configuration

The app configuration can be set in the `src/config` folder, with
[common.json](./src/config/common.json)
loaded in both development and production environments, and then the environment
specific JSON file (with higher priority). More on React enviornment variables
can be seen [here](https://create-react-app.dev/docs/adding-custom-environment-variables).

When writing and deploying an front end with your own node, you likely want to change:

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

## Component Details

### useSubstrate Custom Hook

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

  - `socket` - The remote provider socket it is connecting to.
  - `types` - The custom type used in the connected node.
  - `keyring` - Keyring of the connected node.
  - `keyringState` - One of [`READY`, `ERROR`] states. `keyring` is valid
  only when `keyringState` === `READY`.
  - `api` - The remote api to the connected node.
  - `apiState` - One of [`CONNECTING`, `READY`, `ERROR`] states. `api` is valid
  only when `apiState` === `READY`.


### TxButton Component

There is a `TxButton` component in
[src/substrate-lib/components/TxButton.js](./src/substrate-lib/components/TxButton.js).
It handles a basic [query](https://polkadot.js.org/api/start/api.query.html)
and [transaction](https://polkadot.js.org/api/start/api.tx.html) requests to the
connected node, and app developers can reuse this component by passing the
right parameters in. See [src/Transfer.js](./src/Transfer.js) for a transaction
example and [src/ChainState.js](./src/ChainState.js) for a query example.

## Further Learning

  - To learn more about Substrate front-end development, go to our
  [Substrate Front-End Tutorial](https://substrate.dev/docs/en/tutorials/substrate-front-end/).

  - To try an in-depth tutorial for building a custom Substrate runtime as well as a
  user interface, goto our [Substrate Collectables Workshop](https://substrate-developer-hub.github.io/substrate-collectables-workshop/).

  - To learn how the underlying Polkadot-JS API library works, go to
  [polkadot-js/api](https://polkadot.js.org/api/).
