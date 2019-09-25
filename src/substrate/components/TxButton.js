import React from "react";
import { Button } from "semantic-ui-react";
import { web3FromSource } from "@polkadot/extension-dapp";

import { useSubstrate } from "../";


export default function TxButton({
  accountPair,
  label,
  setStatus,
  type = null,
  attrs = null,
  disabled = false
}) {
  const { api } = useSubstrate();
  let { params = null, sudo = false, tx = null } = attrs;

  const getTxFromType = (type) => {
    switch(type) {
      case "TRANSFER": return api.tx.balances.transfer;
      case "UPGRADE": return api.tx.sudo;
      case "CUSTOM": return tx;
      default: throw new Error(`Unknown TxButton type ${type}`);
    };
  };

  const isSudo = (type, attrs) =>
    ["UPGRADE"].indexOf(type) >= 0 || sudo;

  type && (tx = getTxFromType(type));

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
    let transaction = isSudo(type, attrs) ?
      tx.sudo(...params) : tx(...params);

    transaction.signAndSend(fromParam, ({ status }) => {
      status.isFinalized ?
        setStatus(`Completed at block hash #${status.asFinalized.toString()}`) :
        setStatus(`Current transaction status: ${status.type}`);
    }).catch(e => {
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
