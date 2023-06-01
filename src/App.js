import React, { createRef, useState } from 'react'
import {
  Container,
  Dimmer,
  Loader,
  Grid,
  Sticky,
  Message,
  Button,
} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import { SubstrateContextProvider, useSubstrateState } from './substrate-lib'
import { DeveloperConsole } from './substrate-lib/components'

import AccountSelector from './AccountSelector'
import Balances from './Balances'
import BlockNumber from './BlockNumber'
import Events from './Events'
import Interactor from './Interactor'
import Metadata from './Metadata'
import NodeInfo from './NodeInfo'
import TemplateModule from './TemplateModule'
import Transfer from './Transfer'
import Upgrade from './Upgrade'

import IdChimpUserModule from './IDChimpUser'
import IdChimpVerifierModule from './IDChimpVerifier'
import VerificationProtocol from './IDChimpVerificationProtcol'
import EventsOfAccount from './EventsOfUser'

function Main() {
  const { apiState, apiError, keyringState } = useSubstrateState()

  const [showAdvanced, setShowAdvanced] = useState(false);

  const toggleShowAdvanced = () => setShowAdvanced(!showAdvanced)

  const loader = text => (
    <Dimmer active>
      <Loader size="small">{text}</Loader>
    </Dimmer>
  )

  const message = errObj => (
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message
          negative
          compact
          floating
          header="Error Connecting to Substrate"
          content={`Connection to websocket '${errObj.target.url}' failed.`}
        />
      </Grid.Column>
    </Grid>
  )

  if (apiState === 'ERROR') return message(apiError)
  else if (apiState !== 'READY') return loader('Connecting to Substrate')

  if (keyringState !== 'READY') {
    return loader(
      "Loading accounts (please review any extension's authorization)"
    )
  }

  const contextRef = createRef()

  return (
    <div ref={contextRef}>
      <Sticky context={contextRef}>
        <AccountSelector />
      </Sticky>
      <Container>
        <Grid stackable columns="equal">
          <h1>ID-Chimp Module :: Felidae Network </h1>
          <Grid.Row>
            <Grid.Column>
            <VerificationProtocol />
            </Grid.Column>
            <Grid.Column>
              <Grid.Row>
                <EventsOfAccount />
              </Grid.Row>
              <br />
              <Grid.Row>
                <IdChimpUserModule />
              </Grid.Row>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
             <IdChimpVerifierModule />
            </Grid.Column>
            <Grid.Column>
              <Events />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row stretched>
            <NodeInfo />
            <Metadata />
            <BlockNumber />
            <BlockNumber finalized />
          </Grid.Row>
          <Grid.Row stretched>
            <Balances />
          </Grid.Row>
          <Button onClick={toggleShowAdvanced}>
            {showAdvanced? 'Hide Advanced Options': 'Show Advanced Options'}
            </Button>
          { showAdvanced && (
          <Grid> 
            <Grid.Row>
              <Transfer />
              <Upgrade />
            </Grid.Row>
            <Grid.Row>
              <Interactor />
              <TemplateModule />
            </Grid.Row>
          </Grid>
          )}
        </Grid>
      </Container>
      <DeveloperConsole />
    </div>
  )
}

export default function App() {
  return (
    <SubstrateContextProvider>
      <Main />
    </SubstrateContextProvider>
  )
}
