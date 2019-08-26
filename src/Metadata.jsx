import React, { useEffect, useState } from "react";

import { Grid, Modal, Button, Card } from "semantic-ui-react";

export default function Metadata(props) {
  const { api } = props;

  const [metadata, setMetadata] = useState(0);
  const [version, setVersion] = useState(0);
  useEffect(() => {
    api.rpc.state.getMetadata(meta => {
	  setMetadata(meta);
	  setVersion(meta.version);
    });
  }, [api.rpc.state]);

  return (
    <Grid.Column>
      <Card>
        <Card.Content>
          <Card.Header>Metadata</Card.Header>
		  <Card.Meta>
            <span>v{version}</span>
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <Modal trigger={<Button>Show Metadata</Button>}>
            <Modal.Header>Runtime Metadata</Modal.Header>
            <Modal.Content scrolling>
              <Modal.Description>
                <pre>
                  <code>{JSON.stringify(metadata, null, 2)}</code>
                </pre>
              </Modal.Description>
            </Modal.Content>
          </Modal>
        </Card.Content>
      </Card>
    </Grid.Column>
  );
}
