import React from "react";
import { Button } from "semantic-ui-react";
import { web3FromSource } from "@polkadot/extension-dapp";

export default function TxButton({
  api,
  accountPair,
  label,
  params,
  setStatus,
  tx,
  sudo = false
}) {
  const makeCall = async () => {
    const {
      address,
      meta: { source, isInjected }
    } = accountPair;
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
    let transaction;
    if (sudo) {
      transaction = tx.sudo(...params);
    } else {
      transaction = tx(...params);
    }

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
    <Button onClick={makeCall} primary type="submit" disabled={!accountPair}>
      {label}
    </Button>
  );
}
