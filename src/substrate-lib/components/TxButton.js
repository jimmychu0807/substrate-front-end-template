import React from 'react';
import { Button } from 'semantic-ui-react';
import { web3FromSource } from '@polkadot/extension-dapp';

import { useSubstrate } from '../';

export default function TxButton ({
  accountPair = null,
  label,
  setStatus,
  style = null,
  type = null,
  attrs = null,
  disabled = false
}) {
  const { api } = useSubstrate();
  const { params = null, sudo = false, tx = null } = attrs;
  const isQuery = () => type === 'QUERY';

  const transaction = async () => {
    const {
      address,
      meta: { source, isInjected }
    } = accountPair;
    let fromParam;

    // set the signer
    if (isInjected) {
      const injected = await web3FromSource(source);
      fromParam = address;
      api.setSigner(injected.signer);
    } else {
      fromParam = accountPair;
    }
    setStatus('Sending...');

    let txExecute;
    try {
      // Check if tx has params
      if (!params) {
        txExecute = !sudo ? tx() : tx.sudo();
      } else {
        txExecute = !sudo ? tx(...params) : tx.sudo(...params);
      }
    } catch (e) {
      console.error('ERROR forming transaction:', e);
      setStatus(e.toString());
    }

    if (txExecute) {
      txExecute
        .signAndSend(fromParam, ({ status }) => {
          status.isFinalized
            ? setStatus(
                `Completed at block hash #${status.asFinalized.toString()}`
            )
            : setStatus(`Current transaction status: ${status.type}`);
        })
        .catch(e => {
          setStatus(':( transaction failed');
          console.error('ERROR transaction:', e);
        });
    }
  };

  const query = async () => {
    try {
      const result = await tx(...params);
      setStatus(result.toString());
    } catch (e) {
      console.error('ERROR query:', e);
      setStatus(e.toString());
    }
  };

  return (
    <Button
      primary
      style={style}
      type='submit'
      onClick={isQuery() ? query : transaction}
      disabled={disabled || !tx || (!isQuery() && !accountPair)}
    >
      {label}
    </Button>
  );
}
