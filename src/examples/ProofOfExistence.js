import React, { useState, useEffect } from "react";
import { Form, Input, Grid, Message } from "semantic-ui-react";
import { blake2AsHex } from "@polkadot/util-crypto";

import TxButton from "../TxButton";

// Based on the Substrate Proof of Existence module
// https://github.com/substrate-developer-hub/substrate-proof-of-existence

export default function ProofOfExistence(props) {
  const { api, accountPair } = props;
  const [status, setStatus] = useState("");
  const [digest, setDigest] = useState("");
  const [owner, setOwner] = useState("");
  const [block, setBlock] = useState(0);

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

  useEffect(() => {
    let unsubscribe;

    api.query.poe
      .proofs(digest, result => {
        setOwner(result[0].toString());
        setBlock(result[1].toNumber());
      })
      .then(unsub => {
        unsubscribe = unsub;
      });

    return () => unsubscribe && unsubscribe();
  }, [digest, api.query.poe]);

  function isClaimed() {
    return block !== 0;
  }

  return (
    <Grid.Column>
      <h1>Proof Of Existence</h1>
      <Form success={digest && !isClaimed()} warning={isClaimed()}>
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
            list={[digest, `Owner: ${owner}`, `Block: ${block}`]}
          />
        </Form.Field>

        <Form.Field>
          <TxButton
            api={api}
            accountPair={accountPair}
            label={"Create Claim"}
            setStatus={setStatus}
            params={[digest]}
            tx={api.tx.poe.createClaim}
            disabled={isClaimed() || !digest}
          />
          <TxButton
            api={api}
            accountPair={accountPair}
            label={"Revoke Claim"}
            setStatus={setStatus}
            params={[digest]}
            tx={api.tx.poe.revokeClaim}
            disabled={!isClaimed() || owner !== accountPair.address}
          />
          {status}
        </Form.Field>
      </Form>
    </Grid.Column>
  );
}
