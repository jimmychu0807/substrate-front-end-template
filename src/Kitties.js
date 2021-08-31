import React, { useEffect, useState } from 'react';
import { Form, Grid } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

import KittyCards from './KittyCards';

export default function Kitties (props) {
  const { api, keyring } = useSubstrate();
  const { accountPair } = props;

  const [kittyCnt, setKittyCnt] = useState(0);
  const [kittyDNAs, setKittyDNAs] = useState([]);
  const [kittyOwners, setKittyOwners] = useState([]);
  const [kitties, setKitties] = useState([]);
  const [status, setStatus] = useState('');

  const fetchKittyCnt = () => {
    api.query.kittiesModule.kittiesCount(cnt => {
      const cntNum = cnt.isNone ? 0 : cnt.toJSON();
      setKittyCnt(cntNum);
    });
  };

  const fetchKitties = () => {
    let unsubDnas = null;
    let unsubOwners = null;

    const asyncFetch = async () => {
      const kittyIndices = [...Array(kittyCnt).keys()];

      unsubDnas = await api.query.kittiesModule.kitties.multi(
        kittyIndices,
        dnas => setKittyDNAs(dnas.map(dna => dna.value.toU8a()))
      );

      unsubOwners = await api.query.kittiesModule.owner.multi(
        kittyIndices,
        owners => setKittyOwners(owners.map(owner => owner.toHuman()))
      );
    };

    asyncFetch();

    // return the unsubscription cleanup function
    return () => {
      unsubDnas && unsubDnas();
      unsubOwners && unsubOwners();
    };
  };

  const populateKitties = () => {
    const kittyIndices = [...Array(kittyCnt).keys()];
    const kitties = kittyIndices.map(ind => ({
      id: ind,
      dna: kittyDNAs[ind],
      owner: kittyOwners[ind]
    }));
    setKitties(kitties);
  };

  useEffect(fetchKittyCnt, [api, keyring]);
  useEffect(fetchKitties, [api, kittyCnt]);
  useEffect(populateKitties, [kittyCnt, kittyDNAs, kittyOwners]);

  return <Grid.Column width={16}>
    <h1>小毛孩</h1>
    <KittyCards kitties={kitties} accountPair={accountPair} setStatus={setStatus}/>
    <Form style={{ margin: '1em 0' }}>
      <Form.Field style={{ textAlign: 'center' }}>
        <TxButton
          accountPair={accountPair} label='创建小毛孩' type='SIGNED-TX' setStatus={setStatus}
          attrs={{
            palletRpc: 'kittiesModule',
            callable: 'create',
            inputParams: [],
            paramFields: []
          }}
        />
      </Form.Field>
    </Form>
    <div style={{ overflowWrap: 'break-word' }}>{status}</div>
  </Grid.Column>;
}
