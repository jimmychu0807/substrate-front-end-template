import React, { useState } from 'react';
import { Dropdown, Form, Input } from 'semantic-ui-react';

import UpgradeButton from './UpgradeButton';

export default function Transfer (props) {
  const { api, keyring } = props;
  const [status, setStatus] = useState('');
  const [proposal, setProposal] = useState({});
  const initialState = {
    addressFrom: ''
  };
  const [formState, setFormState] = useState(initialState);
  const { addressFrom } = formState;
  const adminPair = !!addressFrom && keyring.getPair(addressFrom);

  const keyringOptions = keyring.getPairs().map((account) => ({
    key: account.address,
    value: account.address,
    text: account.meta.name.toUpperCase()
  }));

  let fileReader;

  const handleFileRead = (e) => {
    const content = fileReader.result;
    const newProposal = api.tx.consensus.setCode(`0x${content}`);
    setProposal(newProposal);
  };

  const handleFileChosen = (file) => {
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsBinaryString(file);
  };

  const onChange = (_, data) => {
    setFormState(formState => {
      return {
        ...formState,
        [data.state]: data.value
      };
    });
  };

  return (
    <>
      <h1>Upgrade Runtime</h1>
      <Form>
        <Form.Field>
          <Dropdown
            placeholder='Select from your accounts'
            fluid
            label="From"
            onChange={onChange}
            search
            selection
            state='addressFrom'
            options={keyringOptions}
            value={addressFrom}
          />
        </Form.Field>
        <Form.Field>
          <Input
            type='file'
            id='file'
            label="Wasm File"
            accept='.wasm'
            onChange={e => handleFileChosen(e.target.files[0])}
          />
        </Form.Field>
        <Form.Field>
          <UpgradeButton
            api={api}
            adminPair={adminPair}
            label={'Upgrade'}
            params={[proposal]}
            setStatus={setStatus}
            tx={api.tx.sudo}
          />
          {status}
        </Form.Field>
      </Form>
    </>
  );
}
