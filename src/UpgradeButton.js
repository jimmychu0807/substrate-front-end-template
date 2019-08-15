import React from 'react';
import { Button } from 'semantic-ui-react';
import { web3FromSource } from '@polkadot/extension-dapp';


export default function UpgradeButton ({ api, adminPair, label, params, setStatus, tx }) {
  const makeCall = async () => {
    const { address, meta: { source, isInjected } } = adminPair;
    let fromParam;

    //set the signer
    if (isInjected) {
      const injected = await web3FromSource(source);
      fromParam = address;
      api.setSigner(injected.signer);
    } else {
      fromParam = adminPair;
    }
    setStatus('Upgrading...');

    tx.sudo(...params).signAndSend(fromParam, ({ status }) => {
      if (status.isFinalized) {
        setStatus(`Completed at block hash #${status.asFinalized.toString()}`);
      } else {
        setStatus(`Current status: ${status.type}`);
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
