import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import TxButton from './TxButton';

export default function TxGroupButton (props) {
  return (
    <Button.Group>
      <TxButton
        label='Unsigned'
        type='UNSIGNED-TX'
        {...props}
      />
      <Button.Or />
      <TxButton
        color='blue'
        label='Signed'
        type='SIGNED-TX'
        {...props}
      />
      <Button.Or />
      <TxButton
        color='red'
        label='SUDO'
        type='SUDO-TX'
        {...props}
      />
    </Button.Group>
  );
}

// prop typechecking
TxGroupButton.propTypes = {
  accountPair: PropTypes.object,
  setStatus: PropTypes.func,
  attrs: PropTypes.object
};
