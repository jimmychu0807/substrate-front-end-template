import React from 'react';
import { Button } from 'semantic-ui-react';
import { web3FromSource } from '@polkadot/extension-dapp';

import { useSubstrate } from '../';
import utils from '../utils';

export default function TxButton ({
  accountPair = null,
  label,
  setStatus,
  color = 'grey',
  style = null,
  type = 'QUERY',
  attrs = null,
  disabled = false
}) {
  const { api } = useSubstrate();
  const { params = null, tx = null } = attrs;
  const isQuery = () => type === 'QUERY';
  const isSudo = () => type === 'SUDO-TX';
  const isUnsigned = () => type === 'UNSIGNED-TX';
  const isSigned = () => type === 'SIGNED-TX';

  const getFromAcct = async () => {
    const {
      address,
      meta: { source, isInjected }
    } = accountPair;
    let fromAcct;

    // signer is from Polkadot-js browser extension
    if (isInjected) {
      const injected = await web3FromSource(source);
      fromAcct = address;
      api.setSigner(injected.signer);
    } else {
      fromAcct = accountPair;
    }

    return fromAcct;
  };

  const txResHandler = ({ status }) => {
    status.isFinalized
      ? setStatus(`Completed at block hash #${status.asFinalized.toString()}`)
      : setStatus(`Current transaction status: ${status.type}`);
  };

  const txErrHandler = err => {
    setStatus(':( transaction failed');
    console.error('ERROR transaction:', err);
  };

  const sudoTx = async () => {
    const fromAcct = await getFromAcct();
    const { params, tx } = attrs;

    const transformed = params.map(transformParams);
    // transformed can be empty parameters
    const txExecute = transformed ? api.tx.sudo.sudo(tx(...transformed)) : api.tx.sudo.sudo(tx());
    txExecute.signAndSend(fromAcct, txResHandler)
      .catch(txErrHandler);
  };

  const signedTx = async () => {
    const fromAcct = await getFromAcct();
    const { params, tx } = attrs;

    const transformed = params.map(transformParams);
    // transformed can be empty parameters
    const txExecute = transformed ? tx(...transformed) : tx();
    txExecute.signAndSend(fromAcct, txResHandler)
      .catch(txErrHandler);
  };

  const unsignedTx = async () => {
    const { params, tx } = attrs;

    const transformed = params.map(transformParams);
    // transformed can be empty parameters
    const txExecute = transformed ? tx(...transformed) : tx();
    txExecute.send(txResHandler)
      .catch(txErrHandler);
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

  const transaction = async () => {
    setStatus('Sending...');

    if (isSudo()) {
      sudoTx();
    } else if (isSigned()) {
      signedTx();
    } else if (isUnsigned()) {
      unsignedTx();
    } else if (isQuery()) {
      query();
    }
  };

  return (
    <Button
      basic
      color={color}
      style={style}
      type='submit'
      onClick={transaction}
      disabled={disabled || !tx || (!isQuery() && !accountPair)}
    >
      {label}
    </Button>
  );
}

const transformParams = ({ value, type }) => {
  let res;
  if (utils.paramConversion.num.indexOf(type) >= 0) {
    res = type.indexOf('.') >= 0 ? Number.parseFloat(value) : Number.parseInt(value);
  } else {
    res = value;
  }

  return res;
};
