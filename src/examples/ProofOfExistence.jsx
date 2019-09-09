import React, { useState, useEffect } from "react";
import { Form, Input, Grid, Message } from "semantic-ui-react";
import { blake2AsHex } from "@polkadot/util-crypto";

import TxButton from "../TxButton";

export default function Upgrade(props) {
  const { api, accountPair } = props;
  const [status, setStatus] = useState("");
  const [digest, setDigest] = useState("");
  const [owner, setOwner] = useState("");
  const [block, setBlock] = useState(0);

  useEffect(() => {
	api.query.poe.proofs(digest).then(result => {
	  setOwner(result[0].toString());
	  setBlock(result[1].toNumber());
	});
  }, [digest, status, api.query.poe]);

  // Check the module is included in the runtime
  if (!api.tx.poe) {
    return null;
  }

  let fileReader;

  const bufferToDigest = () => {
    const content = Array.from(new Uint8Array(fileReader.result))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    const hash = blake2AsHex(content, 256);
    setDigest(hash);
  };

  const handleFileChosen = file => {
    fileReader = new FileReader();
    fileReader.onloadend = bufferToDigest;
    fileReader.readAsArrayBuffer(file);
  };

  return (
    <Grid.Column>
      <h1>Proof Of Existence</h1>
      <Form success={!!digest && block === 0} warning={block !== 0}>
        <Form.Field>
          <Input
            type="file"
            id="file"
            label="Your File"
            onChange={e => handleFileChosen(e.target.files[0])}
          />
          <Message success header="File Digest Unclaimed" content={digest} />
          <Message
            warning
            header="File Digest Claimed"
            list={[digest,`Owner: ${owner}`,`Block: ${block}`]}
          />
        </Form.Field>

        <Form.Field>
          <TxButton
            api={api}
            accountPair={accountPair}
            label={"Submit Proof"}
            setStatus={setStatus}
            params={[digest]}
            tx={api.tx.poe.createClaim}
          />
          {status}
        </Form.Field>
      </Form>
    </Grid.Column>
  );
}
