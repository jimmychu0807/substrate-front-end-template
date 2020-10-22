import React, {useEffect, useState} from 'react';
import {Card, Grid} from 'semantic-ui-react';

import {useSubstrate} from './substrate-lib';

function Main(props) {
    const {api} = useSubstrate();
    const {finalized} = props;
    const [lastBlockHeader, setLastBlockHeader] = useState(null);

    useEffect(() => {
        let unsubscribeAll = null;

        // make a call to retrieve the current network head
        api.rpc.chain.subscribeNewHeads((header) => {
            console.log(`Chain is at #${header}`);
            setLastBlockHeader(header);
        }).then(unsub => {
            unsubscribeAll = unsub;
        }).catch(console.error);

        return () => unsubscribeAll && unsubscribeAll();
    }, []);

    return (
        <Grid.Column>
            {lastBlockHeader && <Card fluid>
                <Card.Content textAlign='center'>
                    <Card.Header>{'Last Block number: ' + lastBlockHeader.number.toNumber()}</Card.Header>
                    <Card.Meta>{'Hash ' + lastBlockHeader.hash.toHuman()}</Card.Meta>
                    <Card.Description>
                        {'Parent Hash ' + lastBlockHeader.parentHash.toHuman()}
                    </Card.Description>
                </Card.Content>
            </Card>}
        </Grid.Column>
    );
}

export default function LastBlockInfos(props) {
    const {api} = useSubstrate();
    return api.rpc &&
    api.rpc.chain &&
    api.rpc.chain.subscribeNewHeads  ? (
        <Main {...props} />
    ) : null;
}
