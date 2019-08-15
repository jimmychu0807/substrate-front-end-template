import React from 'react';
import { Button } from 'semantic-ui-react';
import { web3FromSource } from '@polkadot/extension-dapp';

export default function TxButton ({ api, fromPair, label, params, setStatus, tx }) {
  const makeCall = async () => {
    const { address, meta: { source, isInjected } } = fromPair;
    let fromParam;

    //set the signer
    if (isInjected) {
      const injected = await web3FromSource(source);
      fromParam = address;
      api.setSigner(injected.signer);
    } else {
      fromParam = fromPair;
    }
    setStatus('Sending...');

    tx(...params).signAndSend(fromParam, ({ status }) => {
      if (status.isFinalized) {
        setStatus(`Completed at block hash #${status.asFinalized.toString()}`);
      } else {
        setStatus(`Current transfer status: ${status.type}`);
      }
    }).catch((e) => {
      setStatus(':( transaction failed');
      console.error('ERROR:', e);
    });
  };

  return (
    <Button
      onClick={makeCall}
      primary
      type='submit'
    >
      {label}
    </Button>
  );
}
