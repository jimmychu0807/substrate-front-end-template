import React, { useEffect, useState } from 'react';
import { Statistic, Grid, Card, Icon } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';

function Main (props) {
  const { api } = useSubstrate();
  const { finalized } = props;
  const [blockNumber, setBlockNumber] = useState(0);
  const [blockNumberTimer, setBlockNumberTimer] = useState(0);

  const bestNumber = finalized
    ? api.derive.chain.bestNumberFinalized
    : api.derive.chain.bestNumber;

  useEffect(() => {
    let unsubscribeAll = null;

    bestNumber(number => {
      setBlockNumber(number.toNumber());
      setBlockNumberTimer(0);
    })
      .then(unsub => {
        unsubscribeAll = unsub;
      })
      .catch(console.error);

    return () => unsubscribeAll && unsubscribeAll();
  }, [bestNumber]);

  const timer = () => {
    setBlockNumberTimer(time => time + 1);
  };

  useEffect(() => {
    const id = setInterval(timer, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Grid.Column>
      <Card>
        <Card.Content textAlign='center'>
          <Statistic
            label={(finalized ? 'Finalized' : 'Current') + ' Block'}
            value={blockNumber}
          />
        </Card.Content>
        <Card.Content extra>
          <Icon name='time' /> {blockNumberTimer}
        </Card.Content>
      </Card>
    </Grid.Column>
  );
}

export default function BlockNumber (props) {
  const { api } = useSubstrate();
  return api.derive &&
    api.derive.chain &&
    api.derive.chain.bestNumber &&
    api.derive.chain.bestNumberFinalized
    ? <Main {...props} />
    : null;
}
