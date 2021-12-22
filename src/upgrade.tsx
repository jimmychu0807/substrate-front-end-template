import React, { useState } from 'react'
import { Form, Input, Grid } from 'semantic-ui-react'
import { TxButton } from './substrate-lib/components'

export default function Main (props) {
  const [status, setStatus] = useState('')
  const [proposal, setProposal] = useState({})
  const { accountPair } = props

  const bufferToHex = buffer => {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  const handleFileChosen = file => {
    const fileReader = new FileReader()
    fileReader.onloadend = e => {
      const content = bufferToHex(fileReader.result)
      setProposal(`0x${content}`)
    }

    fileReader.readAsArrayBuffer(file)
  }

  return (
    <Grid.Column width={8}>
      <h1>Upgrade Runtime</h1>
      <Form>
        <Form.Field>
          <Input
            type='file'
            id='file'
            label='Wasm File'
            accept='.wasm'
            onChange={e => handleFileChosen(e.target.files[0])}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            accountPair={accountPair}
            label='Upgrade'
            type='UNCHECKED-SUDO-TX'
            setStatus={setStatus}
            attrs={{
              palletRpc: 'system',
              callable: 'setCode',
              inputParams: [proposal],
              paramFields: [true]
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  )
}
