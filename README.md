# Substrate Front End Template

This template allows you to create a front-end application that connects to a
[Substrate](https://github.com/paritytech/substrate) node back-end with minimal
configuration. To learn about Substrate itself, visit the
[Substrate Developer Hub](https://substrate.dev).

The template is built with [Create React App](https://github.com/facebook/create-react-app)
and [Polkadot js API](https://polkadot.js.org/api/). Familiarity with these tools
will be helpful, but the template strives to be self-explanatory. To learn how
this template was built, visit the
[Substrate Front-End Tutorial](https://substrate.dev/docs/en/tutorials/substrate-front-end/).

## Using The Template

### Installation

The code can be installed using [git](https://git-scm.com/) and [yarn](https://yarnpkg.com/).
```bash
# Clone the repository
git clone https://substrate-developer-hub/substrate-front-end-template.git
cd ./substrate-front-end-template
```

## Usage
You can start the template in development mode to connect to a locally running node
```bash
yarn start
```

You can also start it in production mode...
TODO @jimmychu What are the details about this again?

## Configuration

The template's configuration is in three files in the `src/config` directory.
* `common.json` affects both development and production environments.
* `development.json` affects only the development environment with higher
precedence than `common.json`.
* `production.json` affects only the production environment with higher
precedence than `common.json`.
TODO @jimmychu what's `test.json`? Can you please write about it or remove it?

More on
[React environment variables](https://create-react-app.dev/docs/adding-custom-environment-variables).

When writing and deploying your own front end, you will likely change:

  - `CUSTOM_TYPES` in `src/config/common.json`. See
  [Extending types](https://polkadot.js.org/api/start/types.extend.html).

  - `PROVIDER_SOCKET` in `src/config/production.json` pointing to your own
  deployed node.

  - `DEVELOPMENT_KEYRING` in `src/config/common.json` be set to `false`.
  See [Keyring](https://polkadot.js.org/api/start/keyring.html).


## Reusable Components

### useSubstrate Custom Hook

The custom hook `useSubstrate` provides access to the Polkadot js API and thus the
keyring and the blockchain itself. Specifically it exposes this API.

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
- `types` - The custom types used in the connected node.
- `keyring` - A keyring of accounts available to the user.
- `keyringState` - One of `"READY"` or `"ERROR"` states. `keyring` is valid
only when `keyringState === "READY"`.
- `api` - The remote api to the connected node.
- `apiState` - One of `"CONNECTING"`, `"READY"`, or `"ERROR"` states. `api` is valid
only when `apiState === "READY"`.


### TxButton Component

The [TxButton](./src/substrate-lib/components/TxButton.js) handles basic [query]
(https://polkadot.js.org/api/start/api.query.html) and [transaction]
(https://polkadot.js.org/api/start/api.tx.html) requests to the connected node.
You can reuse this component for a wide variety of queries and transactiosn. See
[src/Transfer.js](./src/Transfer.js) for a transaction example and [src/ChainState.js]
(./src/ChainState.js) for a query example.

### Account Selector

The [Account Selector](./src/AccountSelector.js) provides the user with a unified way to
select their account from a keyring. If the Balances module is installed in the runtime,
it also displays the user's token balance. It is included in the template already.
