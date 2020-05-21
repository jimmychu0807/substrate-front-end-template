import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { web3FromSource } from '@polkadot/extension-dapp';

import { useSubstrate } from '../';
import utils from '../utils';

function TxButton ({
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
  const [unsub, setUnsub] = useState(null);
  const { palletRpc, callable, inputParams, paramFields } = attrs;

  const isQuery = () => type === 'QUERY';
  const isSudo = () => type === 'SUDO-TX';
  const isUnsigned = () => type === 'UNSIGNED-TX';
  const isSigned = () => type === 'SIGNED-TX';
  const isRpc = () => type === 'RPC';

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
    const transformed = inputParams.map(transformParams);
    // transformed can be empty parameters
    const txExecute = transformed
      ? api.tx.sudo.sudo(api.tx[palletRpc][callable](...transformed))
      : api.tx.sudo.sudo(api.tx[palletRpc][callable]());

    txExecute.signAndSend(fromAcct, txResHandler)
      .catch(txErrHandler);
  };

  const signedTx = async () => {
    const fromAcct = await getFromAcct();
    const transformed = inputParams.map(transformParams);
    // transformed can be empty parameters
    const txExecute = transformed
      ? api.tx[palletRpc][callable](...transformed)
      : api.tx[palletRpc][callable]();

    txExecute.signAndSend(fromAcct, txResHandler)
      .catch(txErrHandler);
  };

  const unsignedTx = () => {
    const transformed = inputParams.map(transformParams);
    // transformed can be empty parameters
    const txExecute = transformed
      ? api.tx[palletRpc][callable](...transformed)
      : api.tx[palletRpc][callable]();

    txExecute.send(txResHandler)
      .catch(txErrHandler);
  };

  const query = async () => {
    const transformed = inputParams.map(transformParams);
    const unsub = await api.query[palletRpc][callable](...transformed, result => {
      result.isNone ? setStatus('None') : setStatus(result.toString());
    });
    setUnsub(unsub);
  };

  const transaction = async () => {
    if (unsub) {
      unsub();
      setUnsub(null);
    }

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

  const transformParams = ({ value, type }) => {
    let res = value;
    if (utils.paramConversion.num.indexOf(type) >= 0) {
      res = type.indexOf('.') >= 0 ? Number.parseFloat(value) : Number.parseInt(value);
    }
    return res;
  };

  const allParamsFilled = () => {
    if (paramFields.length === 0) { return true; }

    return paramFields.every((el, ind) => inputParams[ind] && inputParams[ind].value != null &&
      inputParams[ind].value !== '');
  };

  return (
    <Button
      basic
      color={color}
      style={style}
      type='submit'
      onClick={transaction}
      disabled={disabled || !palletRpc || !callable || !allParamsFilled() }
    >
      {label}
    </Button>
  );
}

// prop typechecking
TxButton.propTypes = {
  accountPair: PropTypes.object,
  setStatus: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['QUERY', 'RPC', 'SIGNED-TX', 'UNSIGNED-TX', 'SUDO-TX']).isRequired,
  attrs: PropTypes.shape({
    palletRpc: PropTypes.string,
    callable: PropTypes.string,
    inputParams: PropTypes.array,
    paramFields: PropTypes.array
  }).isRequired
};

function TxGroupButton (props) {
  return (
    <Button.Group>
      <TxButton
        label='Unsigned'
        type='UNSIGNED-TX'
        {...props}
      />
      <Button.Or />
      <TxButton
        label='Signed'
        type='SIGNED-TX'
        color='blue'
        {...props}
      />
      <Button.Or />
      <TxButton
        label='SUDO'
        type='SUDO-TX'
        color='red'
        {...props}
      />
    </Button.Group>
  );
}

export { TxButton, TxGroupButton };
