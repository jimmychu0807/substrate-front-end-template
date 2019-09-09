import { ApiPromise, WsProvider } from "@polkadot/api";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import keyring from "@polkadot/ui-keyring";
import React, { useState, useEffect, createRef } from "react";
import {
  Container,
  Dimmer,
  Loader,
  Grid,
  Dropdown,
  Menu,
  Sticky
} from "semantic-ui-react";

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
import TemplateModule from "./TemplateModule";
import "semantic-ui-css/semantic.min.css";

export default function App() {
  const [api, setApi] = useState();
  const [apiReady, setApiReady] = useState();
  const [accountLoaded, setAccountLoaded] = useState(false);
  const [accountAddress, setAccountAddress] = useState("");

  //const WS_PROVIDER = "ws://134.209.196.6:9944";           // digital ocean node
  const WS_PROVIDER = "ws://127.0.0.1:9944";                 // localhost
  //const WS_PROVIDER = "wss://dev-node.substrate.dev:9944"; // play node (resets hourly)

  const accountPair = accountAddress && keyring.getPair(accountAddress);

  // get the list of accounts we possess the private key for
  const keyringOptions =
    accountLoaded &&
    keyring.getPairs().map(account => ({
      key: account.address,
      value: account.address,
      text: account.meta.name.toUpperCase(),
      icon: "user"
    }));

  useEffect(() => {
    const provider = new WsProvider(WS_PROVIDER);

    const TYPES = {};
    //const TYPES = {"MyNumber": "u32"};
    // More information on custom types
    // https://github.com/polkadot-js/apps/blob/master/packages/app-settings/src/md/basics.md

    ApiPromise.create({
      provider,
      types: TYPES
    })
      .then(api => {
        setApi(api);
        api.isReady.then(() => setApiReady(true));
      })
      .catch(e => console.error(e));
  }, []);

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
    setAccountLoaded(true);
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

  const contextRef = createRef();

  return (
    <div ref={contextRef}>
      <Container>
        <Sticky context={contextRef}>
          <Menu
            attached="top"
            tabular
            style={{ backgroundColor: "#fff", paddingTop: "1em" }}
          >
            <Menu.Menu position="right">
              <Dropdown
                search
                selection
                placeholder="Select from your accounts"
                options={keyringOptions}
                onChange={(_, dropdown) => {
                  setAccountAddress(dropdown.value);
                }}
              />
            </Menu.Menu>
          </Menu>
        </Sticky>
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
            <Transfer api={api} accountPair={accountPair} />
            <Upgrade api={api} accountPair={accountPair} />
            <TemplateModule api={api} accountPair={accountPair} />
          </Grid.Row>
          <Grid.Row>
            <Extrinsics api={api} accountPair={accountPair} />
            <ChainState api={api} />
            <Events api={api} />
          </Grid.Row>
        </Grid>
        {/* These components don't render elements. */}
        <DeveloperConsole api={api} />
      </Container>
    </div>
  );
}
