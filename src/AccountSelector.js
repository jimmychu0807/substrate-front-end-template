import React, { useState, useEffect } from 'react';

import {
  Menu,
  Dropdown,
  Container,
  Icon,
  Image,
  Label
} from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';

function Main (props) {
  const { api, keyring } = useSubstrate();
  const { setAccountAddress } = props;
  const [accountSelected, setAccountSelected] = useState('');

  // Get the list of accounts we possess the private key for
  const keyringOptions = keyring.getPairs().map(account => ({
    key: account.address,
    value: account.address,
    text: account.meta.name.toUpperCase(),
    icon: 'user'
  }));

  const initialAddress =
    keyringOptions.length > 0 ? keyringOptions[0].value : '';

  // Set the initial address
  useEffect(() => {
    setAccountSelected(initialAddress);
    setAccountAddress(initialAddress);
  }, [setAccountAddress, initialAddress]);

  const onChange = address => {
    // Update state with new account address
    setAccountAddress(address);
    setAccountSelected(address);
  };

  return (
    <Menu
      attached='top'
      tabular
      style={{
        backgroundColor: '#fff',
        borderColor: '#fff',
        paddingTop: '1em',
        paddingBottom: '1em'
      }}
    >
      <Container>
        <Menu.Menu>
          <Image src='Substrate-Logo.png' size='mini' />
        </Menu.Menu>
        <Menu.Menu position='right'>
          {!accountSelected ? (
            <span>
              Add your account with the{' '}
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://github.com/polkadot-js/extension'
              >
                Polkadot JS Extension
              </a>
            </span>
          ) : null}
          <Icon
            name='users'
            size='large'
            circular
            color={accountSelected ? 'green' : 'red'}
          />
          <Dropdown
            search
            selection
            clearable
            placeholder='Select an account'
            options={keyringOptions}
            onChange={(_, dropdown) => {
              onChange(dropdown.value);
            }}
            value={accountSelected}
          />
          {api.query.system && api.query.system.account ? (
            <BalanceAnnotation accountSelected={accountSelected} />
          ) : null}
        </Menu.Menu>
      </Container>
    </Menu>
  );
}

function BalanceAnnotation (props) {
  const { accountSelected } = props;
  const { api } = useSubstrate();
  const [accountBalance, setAccountBalance] = useState(0);

  // When account address changes, update subscriptions
  useEffect(() => {
    let unsubscribe;

    // If the user has selected an address, create a new subscription
    accountSelected &&
      api.query.system
        .account(accountSelected, ({ data: { free: balance } }) => {
          setAccountBalance(balance.toString());
        })
        .then(unsub => {
          unsubscribe = unsub;
        })
        .catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [accountSelected, api.query.system]);

  return accountSelected ? (
    <Label pointing='left'>
      <Icon
        name='money bill alternate'
        color={accountBalance > 0 ? 'green' : 'red'}
      />
      {accountBalance}
    </Label>
  ) : null;
}

export default function AccountSelector (props) {
  const { api, keyring } = useSubstrate();
  return keyring.getPairs && api.query ? <Main {...props} /> : null;
}
