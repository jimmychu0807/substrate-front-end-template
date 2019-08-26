import React, { useEffect, useState } from "react";

import { Statistic, Grid, Card, Icon } from "semantic-ui-react";

export default function BlockNumber(props) {
  const { api } = props;

  const [blockNumber, setBlockNumber] = useState(0);
  const [blockNumberTimer, setBlockNumberTimer] = useState(0);
  useEffect(() => {
    let unsub = api.derive.chain.bestNumber(number => {
      setBlockNumber(number.toNumber());
      setBlockNumberTimer(0);
    });

    return () => unsub && unsub();
  }, [api.derive.chain]);

  const [blockNumberFinalized, setBlockNumberFinalized] = useState(0);
  const [blockNumberFinalizedTimer, setBlockNumberFinalizedTimer] = useState(0);
  useEffect(() => {
    let unsub = api.derive.chain.bestNumberFinalized(number => {
      setBlockNumberFinalized(number.toNumber());
      setBlockNumberFinalizedTimer(0);
    });

    return () => unsub && unsub();
  }, [api.derive.chain]);

  const timer = () => {
	setBlockNumberTimer(time => time + 1);
    setBlockNumberFinalizedTimer(time => time + 1);
  };

  useEffect(() => {
    const id = setInterval(timer, 1000);
    return () => clearInterval(id);
  });

  return (
    <>
      <Grid.Column>
        <Card>
          <Card.Content textAlign="center">
            <Statistic label="Current Block Number" value={blockNumber} />
          </Card.Content>
          <Card.Content extra>
            <Icon name="time" /> {blockNumberTimer}
          </Card.Content>
        </Card>
      </Grid.Column>
      <Grid.Column>
        <Card>
          <Card.Content textAlign="center">
            <Statistic
              label="Finalized Block Number"
              value={blockNumberFinalized}
            />
          </Card.Content>
          <Card.Content extra>
            <Icon name="time" /> {blockNumberFinalizedTimer}
          </Card.Content>
        </Card>
      </Grid.Column>
    </>
  );
}
