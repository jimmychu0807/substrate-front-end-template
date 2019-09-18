import React, { useEffect, useState } from "react";
import { Table, Grid } from "semantic-ui-react";

export default function Balances(props) {
  const { api, keyring } = props;
  const accounts = keyring.getPairs();
  const [balances, setBalances] = useState({});

  useEffect(() => {
    const addresses = keyring.getPairs().map(account => account.address);
    let unsubscribeAll;

    api.query.balances.freeBalance
      .multi(addresses, currentBalances => {
        const balancesMap = addresses.reduce(
          (acc, address, index) => ({
            ...acc,
            [address]: currentBalances[index].toString()
          }),
          {}
        );
        setBalances(balancesMap);
      })
      .then(unsub => {
        unsubscribeAll = unsub;
      })
      .catch(console.error);

    return () => unsubscribeAll && unsubscribeAll();
  }, [api.query.balances.freeBalance, setBalances, keyring]);

  return (
    <Grid.Column>
      <h1>Balances</h1>
      <Table celled striped size="small">
        <Table.Body>
          {accounts.map(account => {
            return (
              <Table.Row key={account.address}>
                <Table.Cell textAlign="right">{account.meta.name}</Table.Cell>
                <Table.Cell>{account.address}</Table.Cell>
                <Table.Cell>{balances && balances[account.address]}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </Grid.Column>
  );
}
