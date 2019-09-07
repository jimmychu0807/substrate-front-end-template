import React, { useState } from "react";
import { Dropdown, Form, Input, Grid } from "semantic-ui-react";

import TxButton from "./TxButton";

export default function Transfer(props) {
  const { api, keyring } = props;
  const [status, setStatus] = useState("");
  const [proposal, setProposal] = useState({});
  const initialState = {
    addressFrom: ""
  };
  const [formState, setFormState] = useState(initialState);
  const { addressFrom } = formState;
  const adminPair = !!addressFrom && keyring.getPair(addressFrom);

  const keyringOptions = keyring.getPairs().map(account => ({
    key: account.address,
    value: account.address,
    text: account.meta.name.toUpperCase()
  }));

  let fileReader;

  const bufferToHex = buffer => {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
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
      <h1>Upgrade Runtime</h1>
      <Form>
        <Form.Field>
          <Dropdown
            placeholder="Select from your accounts"
            fluid
            label="From"
            onChange={onChange}
            search
            selection
            state="addressFrom"
            options={keyringOptions}
          />
        </Form.Field>
        <Form.Field>
          <Input
            type="file"
            id="file"
            label="Wasm File"
            accept=".wasm"
            onChange={e => handleFileChosen(e.target.files[0])}
          />
        </Form.Field>
        <Form.Field>
          <TxButton
            api={api}
            fromPair={adminPair}
            label={"Upgrade"}
            params={[proposal]}
            setStatus={setStatus}
            tx={api.tx.sudo}
            sudo={true}
          />
          {status}
        </Form.Field>
      </Form>
    </Grid.Column>
  );
}
