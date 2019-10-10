import React, { useEffect, useState } from 'react';
import { Table, Grid } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';

function Main (props) {
  const { api, keyring } = useSubstrate();
  const accounts = keyring.getPairs();
  const [balances, setBalances] = useState({});

  useEffect(() => {
    const addresses = keyring.getPairs().map(account => account.address);
    let unsubscribeAll = null;

    api.query.balances.freeBalance
      .multi(addresses, currentBalances => {
        const balancesMap = addresses.reduce(
          (acc, address, index) => ({
            ...acc, [address]: currentBalances[index].toString()
          }), {});
        setBalances(balancesMap);
      }).then(unsub => {
        unsubscribeAll = unsub;
      }).catch(console.error);

    return () => unsubscribeAll && unsubscribeAll();
  }, [api.query.balances.freeBalance, setBalances, keyring]);

  return (
    <Grid.Column>
      <h1>Balances</h1>
      <Table celled striped size='small'>
        <Table.Body>{accounts.map(account =>
          <Table.Row key={account.address}>
            <Table.Cell textAlign='right'>{account.meta.name}</Table.Cell>
            <Table.Cell>{account.address}</Table.Cell>
            <Table.Cell>{
              balances && balances[account.address] &&
              balances[account.address]
            }</Table.Cell>
          </Table.Row>
        )}
        </Table.Body>
      </Table>
    </Grid.Column>
  );
}

export default function Balances (props) {
  const { api } = useSubstrate();
  return (api.query.balances && api.query.balances.freeBalance
    ? <Main {...props} /> : null);
}
