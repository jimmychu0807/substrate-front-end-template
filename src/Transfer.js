import React, { useState } from 'react';
import { Form, Input, Grid } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

function Main (props) {
  const { api } = useSubstrate();
  const [status, setStatus] = useState(null);
  const [formState, setFormState] = useState({ addressTo: null, amount: 0 });
  const { accountPair } = props;

  const onChange = (_, data) =>
    setFormState(prevState => ({ ...formState, [data.state]: data.value }));

  const { addressTo, amount } = formState;

  return (
    <Grid.Column>
      <h1>Transfer</h1>
      <Form>
        <Form.Field>
          <Input
            fluid label='To' type='text' placeholder='address'
            state='addressTo' onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid label='Amount' type='number'
            state='amount' onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <TxButton
            accountPair={accountPair}
            label='Send'
            setStatus={setStatus}
            type='TRANSACTION'
            attrs={{
              params: [addressTo, amount],
              tx: api.tx.balances.transfer
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}

export default function Transfer (props) {
  const { api } = useSubstrate();
  return (api.query.balances && api.tx.balances.transfer
    ? <Main {...props} /> : null);
}
