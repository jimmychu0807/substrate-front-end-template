import React, { useEffect, useState } from 'react';
import { Grid, Form, Dropdown, Input } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

function Main (props) {
  const { api } = useSubstrate();
  const [modulesList, setModulesList] = useState([]);
  const [status, setStatus] = useState(null);
  const [callableFunctionList, setCallableFunctionList] = useState([]);
  const { accountPair } = props;

  const [formState, setFormState] = useState({
    module: '',
    callableFunction: '',
    input: ''
  });
  const { module, callableFunction, input } = formState;

  useEffect(() => {
    const modules = Object.keys(api.tx)
      .sort()
      .map(module => ({
        key: module,
        value: module,
        text: module
      }));

    setModulesList(modules);
  }, [api]);

  useEffect(() => {
    if (module !== '') {
      const callableFunctions = Object.keys(api.tx[module])
        .sort()
        .map(callable => ({
          key: callable,
          value: callable,
          text: callable
        }));

      setCallableFunctionList(callableFunctions);
    }
  }, [api, module]);

  const onChange = (_, data) =>
    setFormState(formState => ({ ...formState, [data.state]: data.value }));

  return (
    <Grid.Column>
      <h1>Extrinsics</h1>
      <Form>
        <Form.Field>
          <Dropdown
            placeholder='Select a module to call'
            fluid
            label='Module'
            onChange={onChange}
            search
            selection
            state='module'
            options={modulesList}
          />
        </Form.Field>
        <Form.Field>
          <Dropdown
            placeholder='Select a function to call'
            fluid
            label='Callable Function'
            onChange={onChange}
            search
            selection
            state='callableFunction'
            options={callableFunctionList}
          />
        </Form.Field>
        <Form.Field>
          <Input
            onChange={onChange}
            label='Input'
            fluid
            placeholder='May not be needed'
            state='input'
            type='text'
          />
        </Form.Field>
        <Form.Field>
          <TxButton
            accountPair={accountPair}
            label='Call'
            setStatus={setStatus}
            type='TRANSACTION'
            attrs={{
              params: input ? [input] : null,
              tx: api.tx[module] && api.tx[module][callableFunction]
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}

export default function Extrinsics (props) {
  const { api } = useSubstrate();
  return api.tx ? <Main {...props} /> : null;
}
