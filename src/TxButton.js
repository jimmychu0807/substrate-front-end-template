import React from "react";
import { Button } from "semantic-ui-react";
import { web3FromSource } from "@polkadot/extension-dapp";

import { useSubstrate } from "./substrate";

export default function TxButton({
  accountPair,
  label,
  params,
  setStatus,
  tx,
  disabled,
  sudo = false
}) {
  const { api } = useSubstrate();

  const makeCall = async () => {
    const { address, meta: { source, isInjected } } = accountPair;
    let fromParam;

    //set the signer
    if (isInjected) {
      const injected = await web3FromSource(source);
      fromParam = address;
      api.setSigner(injected.signer);
    } else {
      fromParam = accountPair;
    }
    setStatus("Sending...");

    // Check if this transaction needs sudo
    let transaction = sudo ? tx.sudo(...params) : tx(...params);

    transaction
      .signAndSend(fromParam, ({ status }) => {
        if (status.isFinalized) {
          setStatus(
            `Completed at block hash #${status.asFinalized.toString()}`
          );
        } else {
          setStatus(`Current transaction status: ${status.type}`);
        }
      })
      .catch(e => {
        setStatus(":( transaction failed");
        console.error("ERROR:", e);
      });
  };

  return (
    <Button onClick={makeCall} primary type="submit"
      disabled={!accountPair || disabled}>
      { label }
    </Button>
  );
}
