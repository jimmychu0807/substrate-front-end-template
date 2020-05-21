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
  color = 'blue',
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
  const isConstant = () => type === 'CONSTANT';

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

  const txResHandler = ({ status }) =>
    status.isFinalized
      ? setStatus(`😉 Finalized. Block hash: ${status.asFinalized.toString()}`)
      : setStatus(`Current transaction status: ${status.type}`);

  const txErrHandler = err =>
    setStatus(`😞 Transaction Failed: ${err.toString()}`);

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

  const rpc = async () => {
    const transformed = inputParams.map(transformParams);
    try {
      const result = await api.rpc[palletRpc][callable](...transformed);
      result.isNone ? setStatus('None') : setStatus(result.toString());
    } catch (err) {
      setStatus(err.toString());
    }
  };

  const constant = () => {
    const result = api.consts[palletRpc][callable];
    result.isNone ? setStatus('None') : setStatus(result.toString());
  };

  const transaction = async () => {
    if (unsub) {
      unsub();
      setUnsub(null);
    }

    setStatus('Sending...');

    isSudo() && sudoTx();
    isSigned() && signedTx();
    isUnsigned() && unsignedTx();
    isQuery() && query();
    isRpc() && rpc();
    isConstant() && constant();
  };

  const transformParams = (param) => {
    if (typeof param !== 'object') {
      // param is a primitive value. Return
      return param;
    }

    const { type, value } = param;
    let res = value;
    if (utils.paramConversion.num.indexOf(type) >= 0) {
      res = type.indexOf('.') >= 0 ? Number.parseFloat(value) : Number.parseInt(value);
    }
    return res;
  };

  const allParamsFilled = () => {
    if (paramFields.length === 0) { return true; }

    return paramFields.every((el, ind) => {
      const param = inputParams[ind];
      if (param == null) { return false; }

      const value = typeof param === 'object' ? param.value : param;
      return value != null && value !== '';
    });
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
  type: PropTypes.oneOf([
    'QUERY', 'RPC', 'SIGNED-TX', 'UNSIGNED-TX', 'SUDO-TX',
    'CONSTANT']).isRequired,
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
        color='grey'
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
