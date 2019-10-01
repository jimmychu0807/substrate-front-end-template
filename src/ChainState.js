import React, { useEffect, useState } from 'react';
import { Grid, Form, Dropdown, Input } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

export default function ChainState (props) {
  const { api } = useSubstrate();
  const [modulesList, setModulesList] = useState([]);
  const [status, setStatus] = useState(null);
  const [storageItemsList, setStorageItemsList] = useState([]);

  const initialState = {
    module: '',
    storageItem: '',
    input: ''
  };
  const [formState, setFormState] = useState(initialState);
  const { module, storageItem, input } = formState;

  useEffect(() => {
    const modules = Object.keys(api.query).sort().map(module => ({
      key: module,
      value: module,
      text: module
    }));

    setModulesList(modules);
  }, [api]);

  useEffect(() => {
    if (module !== '') {
      const storageItems = Object.keys(api.query[module]).sort().map(storage => ({
        key: storage,
        value: storage,
        text: storage
      }));

      setStorageItemsList(storageItems);
    }
  }, [api, module]);

  const onChange = (_, data) => {
    setFormState(formState => {
      return {
        ...formState,
        [data.state]: data.value
      };
    });
  };

  return (
    <Grid.Column>
      <h1>Chain State</h1>
      <Form>
        <Form.Field>
          <Dropdown
            placeholder='Select a module to query'
            fluid
            label='Module'
            onChange={onChange}
            search
            selection
            state='module'
            options={modulesList}
            value={module}
          />
        </Form.Field>
        <Form.Field>
          <Dropdown
            placeholder='Select a storage item to query'
            fluid
            label='Storage Item'
            onChange={onChange}
            search
            selection
            state='storageItem'
            options={storageItemsList}
            value={storageItem}
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
            value={input}
          />
        </Form.Field>
        <Form.Field>
          <TxButton
            label='Query'
            setStatus={setStatus}
            type='QUERY'
            attrs={{
              params: [input],
              tx: (api.query[module] && api.query[module][storageItem])
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}
