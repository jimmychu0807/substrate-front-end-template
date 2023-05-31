import React, { useEffect, useState } from 'react'
import { Card, Form, Grid, Header, Input } from 'semantic-ui-react';

import { useSubstrateState } from './substrate-lib'
import { TxButton } from './substrate-lib/components'

function Main(props) {
  const { 
    api , 
    currentAccount} = useSubstrateState()

  // The transaction submission status
  const [status, setStatus] = useState('')

  // Verifier account data
  const [verifierStatus, setVerifierStatus] = useState('Not Created')

  // Deposite amount
  const [depositAmount, setDepositAmount] = useState(0)

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
          <Header as="h2">Verifier Account Section</Header>
          <span style={{ textAlign: 'left', display: 'block' }}>
            Register your Account as verifier and maintain minimum deposit of 
            100_000_000_000_000 tokens. 
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
                label="Deposite Amount"
                state="depositAmount"
                type="number"
                onChange={(_, { value }) => setDepositAmount(value)}
                />
            </Form.Field>
            <Grid columns={2} centered>
              <Grid.Row>
                <Grid.Column>
                  <Form.Field style={{ textAlign: 'center' }}>
                    <TxButton
                      label="Register Verifier"
                      type="SIGNED-TX"
                      setStatus={setStatus}
                      attrs={{
                        palletRpc: 'verifiers',
                        callable: 'registerVerifier',
                        inputParams: [depositAmount],
                        paramFields: [true],
                      }}
                    />
                    </Form.Field>
                </Grid.Column>
                <Grid.Column>
                  <Form.Field style={{ textAlign: 'center' }}>
                    <TxButton
                      label="Deposit"
                      type="SIGNED-TX"
                      setStatus={setStatus}
                      attrs={{
                        palletRpc: 'verifiers',
                        callable: 'verifierDeposit',
                        inputParams: [depositAmount],
                        paramFields: [true],
                      }}
                    />
                  </Form.Field>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <div style={{ overflowWrap: 'break-word' }}>
              Active address: 
              <span style={{ color: 'black' }}>
                 {currentAccount && `${currentAccount.address.slice(0, 7)}...${currentAccount.address.slice(-7)}` }     
              </span> 
            </div> 
            <br />
            <div style={{ overflowWrap: 'break-word' }}>{status}</div>
          </Form>
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
      <h2 style={{ color: 'red' }}>Verifiers Module not found on the selected chain</h2>
        </Card.Content>
      </Card>
    </Grid.Column>
  )
}

export default function IdChimpVerifierModule(props) {
  const { api } = useSubstrateState()
  return api.query.verifiers  ? (
    <Main {...props} />
  ) : Na()
}
