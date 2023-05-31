import React, { useEffect, useState } from 'react'
import { Form, Input, Grid, Card } from 'semantic-ui-react'

import { useSubstrateState } from './substrate-lib'
import { TxButton } from './substrate-lib/components'

function Main(props) {
  const { 
    api , 
    currentAccount} = useSubstrateState()

  // The transaction submission status
  const [status, setStatus] = useState('')

  // The did creation status
  const [creationStatus, setCreationStatus] = useState('Not Created')
  // The status of verification process 
  const [requestStatus, setRequestStatus] = useState('No Records')
  // Document URL 
  const [formValue, setFormValue] = useState(0)

  useEffect(() => {
    let unsubscribe
    api.query &&
    api.query.verificationProtocol && 
    api.query.verificationProtocol
    .verificationRequests(currentAccount && currentAccount.address, result => {
      // console.log(`attribute value:
      //   ${result ? result.toHuman()? JSON.stringify(result.toHuman()): 
      //     'null' : 'none'}`)
        if (result.isSome){
          let jsonResult = result.toHuman()
          setRequestStatus(jsonResult)
          setCreationStatus(jsonResult.didCreationStatus)
        } else {
          setCreationStatus('Not Created')
          setRequestStatus("No records Available")
        }
      })
      .then(unsub => {
        unsubscribe = unsub
      })
      .catch(console.error)

    return () => unsubscribe && unsubscribe()
  }, [ currentAccount])
  return (
    <Grid.Column width={8}>
      <Card centered fluid style={{ minHeight: '24em' }} >
        <Card.Content textAlign="center">
          <h2>Consumer Section</h2>
          <span style={{ textAlign: 'left', display: 'block' }}>
            Paste the link of the uploaded document and click on the submit button bellow. 
            After the request is made successfully, verifiers will verify and the DID will be created
          </span><br />
          <div> 
            DID Creation status:&nbsp;&nbsp; 
             <span style={{ color: 'red' }}>
               { creationStatus}
             </span>
          </div>
          <div> 
            DID verification status:&nbsp;&nbsp; 
             <span style={{ color: 'red' }}>
               { requestStatus.state? "Being Verified :: stage->"+requestStatus.state.stage :"No Record Found" }
             </span>
          </div>

          <Form>
            <Form.Field>
              <Input
                label="Document's URL"
                state="newValue"
                type="string"
                onChange={(_, { value }) => setFormValue(value)}
                />
            </Form.Field>
            <Form.Field style={{ textAlign: 'center' }}>
              <TxButton
                label="Submit DID verification request"
                type="SIGNED-TX"
                setStatus={setStatus}
                attrs={{
                  palletRpc: 'verificationProtocol',
                  callable: 'submitDidCreationRequest',
                  inputParams: [formValue],
                  paramFields: [true],
                }}
              />
            </Form.Field>
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
      <h2 style={{ color: 'red' }}>DID verification and Creation not available on this chain</h2>
        </Card.Content>
      </Card>
    </Grid.Column>
  )
}

export default function IdChimpUserModule(props) {
  const { api } = useSubstrateState()
  return api.query.verificationProtocol  ? (
    <Main {...props} />
  ) : Na()
}
