import React, { useEffect, useState, useMemo } from "react";
import { Table, Grid } from "semantic-ui-react";

export default function Balances(props) {
  const { api, keyring } = props;
  const accounts = keyring.getPairs();
  const accountNames = accounts.map(account => account.meta.name);
  const [balances, setBalances] = useState({});
  const addresses = useMemo(() => accounts.map(account => account.address),[accounts]);

  useEffect(() => {
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
  }, [api.query.balances.freeBalance, setBalances]);

  return (
    <Grid.Column>
      <h1>Balances</h1>
      <Table celled striped size="small">
        <Table.Body>
          {addresses.map((address, index) => {
            return (
              <Table.Row key={index}>
                <Table.Cell textAlign="right">{accountNames[index]}</Table.Cell>
                <Table.Cell>{address}</Table.Cell>
                <Table.Cell>{balances && balances[address]}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </Grid.Column>
  );
}
