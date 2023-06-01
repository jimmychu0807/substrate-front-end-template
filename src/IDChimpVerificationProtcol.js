import React, { useEffect, useState } from 'react'
import { Card, Form, Grid, Header, Input } from 'semantic-ui-react';
// import { keccakAsHex } from '@polkadot/util-crypto';

import { useSubstrateState } from './substrate-lib'
import { TxButton } from './substrate-lib/components'
import ConsumerDataForm from './ConsumerDataForm'

function Main(props) {
  const { 
    api , 
    currentAccount} = useSubstrateState()

  // The transaction submission status
  const [status, setStatus] = useState('')
  const [statusAck, setStatusAck] = useState('')

  // Verifier account data
  const [verifierStatus, setVerifierStatus] = useState('Not Created')

  // Consumer Account Address
  const [consumerAccount, setConsumerAccount] = useState('')
  // confidence score
  const [cscore, setCscore] = useState(5)

  const [verificationData, setVerificationData] = useState('');

  useEffect(() => {
    let unsubscribe
    api.query.verifiers && 
    api.query.verifiers
    .verifiers(currentAccount && currentAccount.address, result => {
      // console.log(`attribute value:
      //   ${result ? result.toHuman()? JSON.stringify(result.toHuman()): 
      //     'null' : 'none'}`)
        if (result.isSome){
          let jsonResult = result.toHuman()
          setVerifierStatus(jsonResult)
        } else {
          setVerifierStatus('Not Created')
        }
      })
      .then(unsub => {
        unsubscribe = unsub
      })
      .catch(console.error)

    return () => unsubscribe && unsubscribe()
  }, [ api.query.verifiers, currentAccount])
  
  return (
    <Grid.Column width={8}>
      <Card centered fluid style={{ minHeight: '24em' }} >
        <Card.Content textAlign="center">
          <Header as="h2">Consumer Verification Section</Header>
          <span style={{ textAlign: 'left', display: 'block' }}>
            Open the link of the document and fill the consumer details. 
          </span><br />
          <div> 
            Verifier Account Status:&nbsp;&nbsp; 
             <span style={{ color: 'black' }}>
               { verifierStatus.state ||verifierStatus}
             </span>
          </div>
          <div> 
            Deposited Amount:&nbsp;&nbsp; 
             <span style={{ color: 'black' }}>
               {verifierStatus.balance || verifierStatus}
             </span>
          </div>

          <Form>
            <Form.Field>
              <Input
                label="Consumer address"
                state="consumerAccount"
                type="string"
                onChange={(_, { value }) => setConsumerAccount(value)}
                />
            </Form.Field>
            <Form.Field>
              <Input
                label="Confidance Score"
                state="cscore"
                value={cscore}
                type="number"
                onChange={(_, { value }) => setCscore(value)}
                />
            </Form.Field>
            <Form.Field>
              <TxButton
                  label="Accept Task"
                  type="SIGNED-TX"
                  setStatus={setStatusAck}
                  attrs={{
                    palletRpc: 'verificationProtocol',
                    callable: 'acceptVerificationTask',
                    inputParams: [consumerAccount, cscore],
                    paramFields: [true, true],
                  }}
                  />
                  <div style={{ overflowWrap: 'break-word' }}>{statusAck}</div>
            </Form.Field>
          </Form>
           <br/>
           <Grid.Row>
            < ConsumerDataForm setVerificationData={setVerificationData} />
           </Grid.Row>
            <Grid.Row >
                    <TxButton
                      label="Submit Verification Data"
                      type="SIGNED-TX"
                      setStatus={setStatus}
                      attrs={{
                        palletRpc: 'verificationProtocol',
                        callable: 'submitVerificationData',
                        inputParams: [consumerAccount, verificationData.hashedConsumerData],
                        paramFields: [true, true],
                      }}
                    />

                    <TxButton
                      label="Reval Data"
                      type="SIGNED-TX"
                      setStatus={setStatus}
                      attrs={{
                        palletRpc: 'verificationProtocol',
                        callable: 'revealData',
                        inputParams: [consumerAccount, verificationData.consumerData, verificationData.secret],
                        paramFields: [true, true, true],
                      }}
                    />
            </Grid.Row>
            <Grid.Row>
              <div style={{ overflowWrap: 'break-word' }}>
              Active address: 
              <span style={{ color: 'black' }}>
                 {currentAccount && `${currentAccount.address.slice(0, 7)}...${currentAccount.address.slice(-7)}` }     
              </span> 
            </div> 
            </Grid.Row>
             <div style={{ overflowWrap: 'break-word' }}>{status}</div>
         
        </Card.Content>
      </Card>
    </Grid.Column>      
  )
}

const Na = () => {
  return(
    <Grid.Column width={8}>
      <Card centered fluid style={{ minHeight: '24em' }} >
        <Card.Content textAlign="center">
      <h2 style={{ color: 'red' }}>Verification Process Module not found on the selected chain</h2>
        </Card.Content>
      </Card>
    </Grid.Column>
  )
}

export default function VerificationProtocol(props) {
  const { api } = useSubstrateState()
  return api.query.verifiers  ? (
    <Main {...props} />
  ) : Na()
}
