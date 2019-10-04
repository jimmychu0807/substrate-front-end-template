import React, { useEffect, useState } from 'react';
import { Form, Input, Grid, Card, Statistic } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

function Main (props) {
  const { api } = useSubstrate();
  const { accountPair } = props;

  // The transaction submission status
  const [status, setStatus] = useState('');

  // The currently stored value
  const [currentValue, setCurrentValue] = useState(0);
  const [formValue, setFormValue] = useState(0);

  useEffect(() => {
    let unsubscribe;
    api.query.templateModule.something(newValue => {
      // The storage value is an Option<u32>
      // So we have to check whether it is None first
      // There is also unwrapOr
      if (newValue.isNone) {
        setCurrentValue('<None>');
      } else {
        setCurrentValue(newValue.unwrap().toNumber());
      }
    }).then(unsub => {
      unsubscribe = unsub;
    })
      .catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [api.query.templateModule]);

  return (
    <Grid.Column>
      <h1>Template Module</h1>
      <Card>
        <Card.Content textAlign='center'>
          <Statistic
            label='Current Value'
            value={currentValue}
          />
        </Card.Content>
      </Card>
      <Form>
        <Form.Field>
          <Input
            type='number'
            id='new_value'
            state='newValue'
            label='New Value'
            onChange={(_, { value }) => setFormValue(value)}
          />
        </Form.Field>
        <Form.Field>
          <TxButton
            accountPair={accountPair}
            label='Store Something'
            setStatus={setStatus}
            type='TRANSACTION'
            attrs={{
              params: [formValue],
              tx: api.tx.templateModule.doSomething
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}

export default function TemplateModule (props) {
  const { api } = useSubstrate();
  return (api.query.templateModule && api.query.templateModule.something
    ? <Main {...props} /> : null);
}
