import React, { createRef } from 'react'
import {
  Container,
  Dimmer,
  Loader,
  Grid,
  Sticky,
  Message
} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import {
  SubstrateProvider,
  useSubstrateState
} from './substrate-lib'
// ray test touch <
import {
  ApiStatus,
  KeyringStatus,
  ActionType
} from './substrate-lib/SubstrateContext';
// ray test touch >
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

function Main() {
  // ray test touch <
  const { apiStatus, apiError, keyringStatus, keyring, api } = useSubstrateState()
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
  // if (apiStatus === 'ERROR') return message(apiError)
  // else if (apiStatus !== 'READY') return loader('Connecting to Substrate')
  // if (keyringStatus !== 'READY') {
  //   return loader(
  //     "Loading accounts (please review any extension's authorization)"
  //   )
  // }
  switch (apiStatus) {
    case ApiStatus.Idle:
    case ApiStatus.ConnectInit:
    case ApiStatus.Connecting:
      return (
        // <FullLoadingSpinner text={`Connecting to ${RELAY_CHAIN_NAME}`} />
        loader('Connecting to Substrate')
      );
    case ApiStatus.Ready:
      break;
    case ApiStatus.Error:
      // handleError(state.apiError);
      // console.log('ray : ***** handleError(state.apiError)')
      return message(apiError)
    default:
      throw new Error('Invalid ApiStatus!');
  }
  
  switch (keyringStatus) {
    case KeyringStatus.Idle:
    case KeyringStatus.Loading:
      return (
        // <FullLoadingSpinner text='Loading accounts (please review any extensions authorization)' />
        <>Loading accounts (please review any extensions authorization)</>
      );
    case KeyringStatus.Ready:
      break;
    case KeyringStatus.Error:
      throw new Error(`${ActionType.SetKeyringError}!`);
    default:
      throw new Error('Invalid KeyringStatus!');
  }
  
  if (
    keyring === null ||
    api === null
  ) {
    throw new Error('Something went wrong!');
  }
  // ray test touch >

  const contextRef = createRef()

  return (
    <div ref={contextRef}>
      <Sticky context={contextRef}>
        <AccountSelector />
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
            <Balances />
          </Grid.Row>
          <Grid.Row>
            <Transfer />
            <Upgrade />
          </Grid.Row>
          <Grid.Row>
            <Interactor />
            <Events />
          </Grid.Row>
          <Grid.Row>
            <TemplateModule />
          </Grid.Row>
        </Grid>
      </Container>
      <DeveloperConsole />
    </div>
  )
}

export default function App() {
  return (
    <SubstrateProvider>
      <Main />
    </SubstrateProvider>
  )
}
