import React, { useEffect, useState } from 'react';
import { Form, Grid } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

import KittyCards from './KittyCards';

export default function Kitties (props) {
  const { api, keyring } = useSubstrate();
  const { accountPair } = props;

  const [kittyCnt, setKittyCnt] = useState(0);
  const [kittyHashes, setKittyHashes] = useState([]);
  const [kittyStructs, setKittyStructs] = useState([]);
  const [kittyOwners, setKittyOwners] = useState([]);
  const [fetchState, setFetchState] = useState(0);
  const [kitties, setKitties] = useState([]);
  const [status, setStatus] = useState('');

  const fetchKittyCnt = () => {
    api.query.substrateKitties.allKittiesCount(cnt => {
      const cntNum = cnt.isNone ? 0 : cnt.toJSON();
      setKittyCnt(cntNum);
    });
  };

  const fetchKittyHashes = () => {
    // Increment by 1 because KittyIndex start from 1 instead of 0
    const kittyIndices = [...Array(kittyCnt).keys()].map(el => el + 1);
    api.query.substrateKitties.allKittiesArray.multi(
      kittyIndices,
      hashes => {
        setFetchState(0);
        setKittyHashes(hashes.map(hash => hash.toJSON()));
      }
    );
  };

  const fetchKitties = () => {
    let unsubKittyStructs = null;
    let unsubOwners = null;

    const asyncFetch = async () => {
      unsubKittyStructs = await api.query.substrateKitties.kitties.multi(
        kittyHashes,
        kitties => {
          setFetchState(fetchState => fetchState + 1);
          setKittyStructs(kitties.map(kitty => ({
            id: kitty.id.toJSON(),
            dna: kitty.dna,
            price: kitty.price.toJSON(),
            gender: kitty.gender.toJSON()
          })));
        }
      );

      unsubOwners = await api.query.substrateKitties.kittyOwner.multi(
        kittyHashes,
        owners => {
          setFetchState(fetchState => fetchState + 1);
          setKittyOwners(owners.map(owner => owner.toJSON()));
        }
      );
    };

    asyncFetch();

    // return the unsubscription cleanup function
    return () => {
      unsubKittyStructs && unsubKittyStructs();
      unsubOwners && unsubOwners();
    };
  };

  const populateKitties = () => {
    if (fetchState < 2) {
      // We are still in the middle of fetching data
      return;
    }

    const kitties = kittyHashes.map((hash, ind) => ({
      // Increment by 1 because KittyIndex start from 1 instead of 0
      ind: ind + 1,
      id: hash,
      dna: kittyStructs[ind].dna,
      price: kittyStructs[ind].price,
      gender: kittyStructs[ind].gender,
      owner: kittyOwners[ind]
    }));
    setKitties(kitties);
  };

  useEffect(fetchKittyCnt, [api, keyring]);
  useEffect(fetchKittyHashes, [api, kittyCnt]);
  useEffect(fetchKitties, [api, kittyHashes]);
  useEffect(populateKitties, [fetchState, kittyHashes, kittyStructs, kittyOwners]);

  return <Grid.Column width={16}>
    <h1>Kitties</h1>
    <KittyCards kitties={kitties} accountPair={accountPair} setStatus={setStatus}/>
    <Form style={{ margin: '1em 0' }}>
      <Form.Field style={{ textAlign: 'center' }}>
        <TxButton
          accountPair={accountPair} label='Create Kitty' type='SIGNED-TX' setStatus={setStatus}
          attrs={{
            palletRpc: 'substrateKitties',
            callable: 'createKitty',
            inputParams: [],
            paramFields: []
          }}
        />
      </Form.Field>
    </Form>
    <div style={{ overflowWrap: 'break-word' }}>{status}</div>
  </Grid.Column>;
}
