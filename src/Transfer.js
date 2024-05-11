import React, { useState } from 'react'
import { Form, Input, Grid, Label, Icon, Dropdown } from 'semantic-ui-react'
import { TxButton } from './substrate-lib/components'
import { useSubstrateState } from './substrate-lib'

export default function Main(props) {
  const [status, setStatus] = useState(null)
  const [formState, setFormState] = useState({ addressTo: '', amount: 0 })

  const onChange = (_, data) =>
    setFormState(prev => ({ ...prev, [data.state]: data.value }))

  const { addressTo, amount } = formState

  const { keyring } = useSubstrateState()
  const accounts = keyring.getPairs()

  const availableAccounts = []
  accounts.map(account => {
    return availableAccounts.push({
      key: account.meta.name,
      text: account.meta.name,
      value: account.address,
    })
  })

  return (
    <Grid.Column width={8}>
      <h1>Transfer</h1>
      <Form>
        <Form.Field>
          <Label basic color="teal">
            <Icon name="hand point right" />1 Unit = 1000000000000&nbsp;
          </Label>
          <Label
            basic
            color="teal"
            style={{ marginLeft: 0, marginTop: '.5em' }}
          >
            <Icon name="hand point right" />
            Transfer more than the existential amount for account with 0 balance
          </Label>
        </Form.Field>

        <Form.Field>
          <Dropdown
            placeholder="Select from available addresses"
            fluid
            selection
            search
            options={availableAccounts}
            state="addressTo"
            onChange={onChange}
          />
        </Form.Field>

        <Form.Field>
          <Input
            fluid
            label="To"
            type="text"
            placeholder="address"
            value={addressTo}
            state="addressTo"
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label="Amount"
            type="number"
            state="amount"
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            label="Submit"
            type="SIGNED-TX"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'balances',
              callable: 'transfer',
              inputParams: [addressTo, amount],
              paramFields: [true, true],
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  )
}
