import React, { useState } from 'react';
import { Form, Input, Grid } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

function Main (props) {
  const { api } = useSubstrate();
  const [status, setStatus] = useState('');
  const [proposal, setProposal] = useState({});
  const { accountPair } = props;

  let fileReader;

  const bufferToHex = buffer => {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleFileRead = e => {
    const content = bufferToHex(fileReader.result);
    const newProposal = api.tx.system.setCode(`0x${content}`);
    setProposal(newProposal);
  };

  const handleFileChosen = file => {
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsArrayBuffer(file);
  };

  return (
    <Grid.Column>
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
        <Form.Field>
          <TxButton
            accountPair={accountPair}
            label='Upgrade'
            setStatus={setStatus}
            type='TRANSACTION'
            attrs={{
              params: [proposal],
              sudo: true,
              tx: api.tx.sudo
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}

export default function Upgrade (props) {
  const { api } = useSubstrate();
  return api.tx && api.tx.sudo ? <Main {...props} /> : null;
}
