import React, { useEffect, useState } from 'react';
import { Grid, Form, Dropdown, Input } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxGroupButton } from './substrate-lib/components';

function Main (props) {
  const { api } = useSubstrate();
  const { accountPair } = props;
  const [status, setStatus] = useState(null);
  const [pallets, setPallets] = useState([]);
  const [extrinsics, setExtrinsics] = useState([]);
  const [paramFields, setParamFields] = useState([]);

  const [formState, setFormState] = useState({
    pallet: '',
    extrinsic: '',
    inputParams: []
  });
  const { pallet, extrinsic, inputParams } = formState;

  const updatePallets = () => {
    const pallets = Object.keys(api.tx)
      .sort()
      .map(pallet => ({
        key: pallet,
        value: pallet,
        text: pallet
      }));

    setPallets(pallets);
  };

  const updateExtrinsics = () => {
    if (pallet === '' || !api.tx[pallet]) { return; }

    const extrinsics = Object.keys(api.tx[pallet])
      .sort()
      .map(callable => ({
        key: callable,
        value: callable,
        text: callable
      }));

    setExtrinsics(extrinsics);
    // We want to clear the parameter list too. Because at this state, we have unset chosen
    //   extrinsic, if we have chosen one.
    setParamFields([]);
  };

  const updateParamFields = () => {
    if (pallet === '' || extrinsic === '' || !api.tx[pallet] || !api.tx[pallet][extrinsic]) {
      return;
    }

    const paramFields = api.tx[pallet][extrinsic].meta.args.map(arg => ({
      name: arg.name.toString(),
      type: arg.type.toString()
    }));
    setParamFields(paramFields);
  };

  useEffect(updatePallets, [api]);
  useEffect(updateExtrinsics, [api, pallet]);
  useEffect(updateParamFields, [api, pallet, extrinsic]);

  const onChange = (_, data) => {
    setFormState(formState => {
      let res;
      if (typeof data.state === 'object') {
        const { ind, type } = data.state;
        formState.inputParams[ind] = { value: data.value, type };
        res = formState;
      } else if (data.state === 'pallet') {
        res = { ...formState, [data.state]: data.value, extrinsic: '', inputParams: [] };
      } else if (data.state === 'extrinsic') {
        res = { ...formState, [data.state]: data.value, inputParams: [] };
      }
      return res;
    });
  };

  return (
    <Grid.Column>
      <h1>Extrinsics</h1>
      <Form>
        <Form.Field>
          <Dropdown
            placeholder='Pallets'
            fluid
            label='Pallet'
            onChange={onChange}
            search
            selection
            state='pallet'
            options={pallets}
          />
        </Form.Field>
        <Form.Field>
          <Dropdown
            placeholder='Extrinsics'
            fluid
            label='Extrinsic'
            onChange={onChange}
            search
            selection
            state='extrinsic'
            options={extrinsics}
          />
        </Form.Field>
        {paramFields.map((paramField, ind) =>
          <Form.Field key={`${paramField.name}-${paramField.type}`}>
            <Input
              placeholder={paramField.type}
              fluid
              type='text'
              label={paramField.name}
              state={{ ind, type: paramField.type }}
              onChange={onChange}
            />
          </Form.Field>
        )}
        <Form.Field style={{ textAlign: 'center' }}>
          <TxGroupButton
            accountPair={accountPair}
            setStatus={setStatus}
            attrs={{
              params: inputParams,
              tx: api.tx[pallet] && api.tx[pallet][extrinsic]
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
