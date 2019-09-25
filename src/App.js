import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import keyring from "@polkadot/ui-keyring";
import React, { useState, useEffect, createRef } from "react";
import { Container, Dimmer, Loader, Grid, Sticky } from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css";

import { useSubstrate } from "./substrate";
import { DeveloperConsole } from "./substrate/components";

import AccountSelector from "./AccountSelector";
import Balances from "./Balances";
import BlockNumber from "./BlockNumber";
import ChainState from "./ChainState";
import Events from "./Events";
import Extrinsics from "./Extrinsics";
import Metadata from "./Metadata";
import NodeInfo from "./NodeInfo";
import Transfer from "./Transfer";
import Upgrade from "./Upgrade";

import ProofOfExistence from "./examples/ProofOfExistence";
import TemplateModule from "./examples/TemplateModule";

export default function App() {
  const [accountLoaded, setAccountLoaded] = useState(false);
  const [accountAddress, setAccountAddress] = useState("");

  const accountPair = accountAddress && keyring.getPair(accountAddress);

  const { api, apiError, apiReady } = useSubstrate();

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
    keyring.loadAll({isDevelopment: true}, injectedAccounts);
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

  if (apiError) {
    return loader(apiError);
  }

  if (!accountLoaded) {
    return loader("Loading accounts (please review any extension's authorization)");
  }

  const contextRef = createRef();

  return (
    <div ref={contextRef}>
      <Sticky context={contextRef}>
        <AccountSelector
          keyring={keyring}
          setAccountAddress={setAccountAddress}
        />
      </Sticky>
      <Container>
        <Grid stackable columns="equal">
          <Grid.Row stretched>
            <NodeInfo />
            <Metadata />
            <BlockNumber />
            <BlockNumber finalized />
          </Grid.Row>
          <Grid.Row stretched>
            <Balances keyring={keyring} />
          </Grid.Row>
          <Grid.Row>
            <Transfer accountPair={accountPair} />
            <Upgrade accountPair={accountPair} />
          </Grid.Row>
          <Grid.Row>
            <Extrinsics accountPair={accountPair} />
            <ChainState />
            <Events />
          </Grid.Row>
          {/* These components render if a module is present in the runtime.*/}
          <Grid.Row>
            { api.query.poe && <ProofOfExistence accountPair={accountPair}/> }
            { api.query.templateModule && <TemplateModule accountPair={accountPair} /> }
          </Grid.Row>

        </Grid>
        <DeveloperConsole/>
      </Container>
    </div>
  );
}
