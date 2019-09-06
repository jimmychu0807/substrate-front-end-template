import React, { useState } from "react";
import { Form, Input, Grid, Card, Statistic } from "semantic-ui-react";

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
      <h1>Template Module</h1>
      <Card>
      <Card.Content textAlign="center">
        <Statistic
          label="Current Value"
          value={5}//TODO
        />
      </Card.Content>
      </Card>
      <Form>
        <Form.Field>
          <Input
            type="number"
            id="new_value"
            label="New Value"
            onChange={() => "TODO"}
          />
        </Form.Field>
        <Form.Field>
          <TxButton
            api={api}
            fromPair={adminPair}
            label={"Store Something"}
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
