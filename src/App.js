import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import keyring from "@polkadot/ui-keyring";
import React, { useState, useEffect, createRef } from "react";
import { Container, Dimmer, Loader, Grid, Sticky } from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css";

import config from "./config";
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
  const { api, apiError, apiReady } = useSubstrate();

  const accountPair = accountAddress && keyring.getPair(accountAddress);
  // new hook to get injected accounts
  useEffect(() => {
    const loadAccounts = async() => {
      try {
        await web3Enable(config.APP_NAME);
        let allAccounts = await web3Accounts();
        allAccounts = allAccounts.map(({ address, meta }) =>
          ({ address, meta: { ...meta, name: `${meta.name} (${meta.source})` }}));

        keyring.loadAll({ isDevelopment: config.DEVELOPMENT_KEYRING }, allAccounts);
        setAccountLoaded(true);
      } catch (e) {
        console.error(e);
      }
    };

    loadAccounts();
  }, []);

  const loader = (text) =>
    <Dimmer active><Loader size="small">{text}</Loader></Dimmer>;

  if (!apiReady) return loader("Connecting to the blockchain");
  if (apiError) return loader(apiError);
  if (!accountLoaded) return loader("Loading accounts (please review any extension's authorization)");

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
          <Grid.Row>
            { api.query.poe && <ProofOfExistence accountPair={accountPair}/> }
            { api.query.templateModule && api.query.templateModule.something &&
              <TemplateModule accountPair={accountPair} /> }
          </Grid.Row>
        </Grid>
        <DeveloperConsole/>
      </Container>
    </div>
  );
}
