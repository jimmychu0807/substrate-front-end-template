import { ApiPromise, WsProvider } from "@polkadot/api";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import keyring from "@polkadot/ui-keyring";
import React, { useState, useEffect } from "react";
import { Container, Dimmer, Loader, Grid } from "semantic-ui-react";

import Balances from "./Balances";
import BlockNumber from "./BlockNumber";
import ChainState from "./ChainState";
import DeveloperConsole from "./DeveloperConsole";
import Events from "./Events";
import Extrinsics from "./Extrinsics";
import Metadata from "./Metadata";
import NodeInfo from "./NodeInfo";
import Transfer from "./Transfer";
import Upgrade from "./Upgrade";
import "semantic-ui-css/semantic.min.css";

export default function App() {
  const [api, setApi] = useState();
  const [apiReady, setApiReady] = useState();
  const [accountLoaded, setaccountLoaded] = useState(false);
  //const WS_PROVIDER = "ws://127.0.0.1:9944";
  const WS_PROVIDER = 'wss://dev-node.substrate.dev:9944';
  const TYPES = {};
  //const TYPES = {"MyNumber": "u32"};
  // More information on custom types
  // https://github.com/polkadot-js/apps/blob/master/packages/app-settings/src/md/basics.md

  useEffect(() => {
    const provider = new WsProvider(WS_PROVIDER);

    ApiPromise.create({
      provider,
      types: TYPES,
    })
      .then(api => {
        setApi(api);
        api.isReady.then(() => setApiReady(true));
      })
      .catch(e => console.error(e));
  }, [TYPES]);

  // new hook to get injected accounts
  useEffect(() => {
    web3Enable("substrate-front-end-tutorial")
      .then(extensions => {
        // web3Account promise resolves with an array of injected accounts
        // or an empty array (e.g user has no extension, or not given access to their accounts)
        web3Accounts()
          .then(accounts => {
            // add the source to the name to avoid confusion
            return accounts.map(({ address, meta }) => ({
              address,
              meta: {
                ...meta,
                name: `${meta.name} (${meta.source})`
              }
            }));
          })
          // load our keyring with the newly injected accounts
          .then(injectedAccounts => {
            loadAccounts(injectedAccounts);
          })
          .catch(console.error);
      })
      .catch(console.error);
  }, []);

  const loadAccounts = injectedAccounts => {
    keyring.loadAll(
      {
        isDevelopment: true
      },
      injectedAccounts
    );
    setaccountLoaded(true);
  };

  const loader = function(text) {
    return (
      <Dimmer active>
        <Loader size="small">{text}</Loader>
      </Dimmer>
    );
  };

  if (!apiReady) {
    return loader("Connecting to the blockchain");
  }

  if (!accountLoaded) {
    return loader(
      "Loading accounts (please review any extension's authorization)"
    );
  }

  return (
    <Container style={{ marginTop: "3em" }}>
      <Grid stackable columns="equal">
        <Grid.Row stretched>
          <NodeInfo api={api} />
          <Metadata api={api} />
          <BlockNumber api={api} />
          <BlockNumber api={api} finalized />
        </Grid.Row>
        <Grid.Row stretched>
          <Balances api={api} keyring={keyring} />
        </Grid.Row>
        <Grid.Row>
          <Transfer api={api} keyring={keyring} />
          <Upgrade api={api} keyring={keyring} />
        </Grid.Row>
        <Grid.Row>
          <Extrinsics api={api} keyring={keyring} />
          <ChainState api={api} />
          <Events api={api} />
        </Grid.Row>
      </Grid>
      {/* These components don't render elements. */}
      <DeveloperConsole api={api} />
    </Container>
  );
}
