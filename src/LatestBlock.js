import React, { useEffect, useState } from 'react';
import { Grid, Table } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';

export default function Main (props) {
  const { api } = useSubstrate();
  const [block, setBlock] = useState();

  useEffect(() => {
    let unsubscribeAll = null;
    api.rpc.chain
      .subscribeNewHeads((header) => {
        setBlock(header);
      });
    return () => unsubscribeAll && unsubscribeAll();
  }, [api.derive.chain, api.rpc.chain, block]);

  return (
    <Grid.Column>
      {block && (
        <Table celled>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Latest Block</Table.Cell>
              <Table.Cell>{block.number.toNumber()}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Hash</Table.Cell>
              <Table.Cell>{block.hash.toHuman()}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>ParentHash</Table.Cell>
              <Table.Cell>{block.parentHash.toHuman()}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>State Root</Table.Cell>
              <Table.Cell>{block.stateRoot.toHuman()}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Extrinsics Root</Table.Cell>
              <Table.Cell>{block.extrinsicsRoot.toHuman()}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      )}
    </Grid.Column>
  );
}
