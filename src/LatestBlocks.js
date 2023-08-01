import React, { useEffect, useState } from 'react';
import { Table, Grid } from 'semantic-ui-react';
import { useSubstrateState } from './substrate-lib';

export default function LatestBlocks() {
  const { api } = useSubstrateState();
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    let unsubscribeAll = null;

    api.rpc.chain.subscribeNewHeads((header) => {
      console.log(`Chain is at block: ${header.number}`);
      // Include both the block number and hash in the state
      // Keep only the last 20 blocks
      setBlocks(blocks => [...blocks, { number: header.number.toString(), hash: header.hash.toString() }].slice(-20));
    })
    .then(unsub => {
      unsubscribeAll = unsub;
    })
    .catch(console.error);

    return () => unsubscribeAll && unsubscribeAll();
  }, [api]);

  return (
    <Grid.Column>
      <h1>Latest Blocks</h1>
      <Table celled striped size="small">
        <Table.Body>
          <Table.Row>
            <Table.Cell><strong>Block Number</strong></Table.Cell>
            <Table.Cell><strong>Block Hash</strong></Table.Cell>
          </Table.Row>
          {blocks.map(block => (
            <Table.Row key={block.number}>
              <Table.Cell>{block.number}</Table.Cell>
              <Table.Cell>{block.hash}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Grid.Column>
  );
}
