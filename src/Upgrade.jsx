import React, { useState } from "react";
import { Form, Input, Grid } from "semantic-ui-react";

import TxButton from "./TxButton";

export default function Upgrade(props) {
  const { api, accountPair } = props;
  const [status, setStatus] = useState("");
  const [proposal, setProposal] = useState({});

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

  return (
    <Grid.Column>
      <h1>Upgrade Runtime</h1>
      <Form>
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
            accountPair={accountPair}
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
