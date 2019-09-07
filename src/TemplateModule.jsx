import React, { useEffect, useState } from "react";
import { Form, Input, Grid, Card, Statistic, Dropdown } from "semantic-ui-react";

import TxButton from "./TxButton";

export default function Transfer(props) {
  const { api, keyring } = props;

  // The transaction submission status
  const [status, setStatus] = useState("");

  // The currently stored value
  const [currentValue, setCurrentValue] = useState(0);
  const initialState = {
    addressFrom: "",
    newValue: 0,
  };
  const [formState, setFormState] = useState(initialState);
  const { addressFrom, newValue } = formState;
  const adminPair = !!addressFrom && keyring.getPair(addressFrom);

  // This was leftover from the runtime upgrade example.
  // Do I still need it?
  const keyringOptions = keyring.getPairs().map(account => ({
    key: account.address,
    value: account.address,
    text: account.meta.name.toUpperCase()
  }));

  const onChange = (first, data) => {
    setFormState(formState => {
      return {
        ...formState,
        [data.state]: data.value
      };
    });
  };

  useEffect(() => {
    let unsubscribe;
    api.query.templateModule.something(newValue => {
      // The storage value is an Option<u32>
      // So we have to check whether it is None first
      // https://stackoverflow.com/q/679915/4184410
      if (Object.keys(newValue.raw).length === 0){
        setCurrentValue("<None>");
      }
      else{
        // Not none, so we can access the raw value
        setCurrentValue(newValue.raw.toNumber());
      }
    }).then(unsub => {
      unsubscribe = unsub;
    })
    .catch(console.error);

    return () => unsubscribe && unsubscribe();

  }, [api.query.templateModule, api.query.templateModule.something]);


  return (
    <Grid.Column>
      <h1>Template Module</h1>
      <Card>
      <Card.Content textAlign="center">
        <Statistic
          label="Current Value"
          value={currentValue}
        />
      </Card.Content>
      </Card>
      <Form>
        <Form.Field>
          <Dropdown
            placeholder="Select from your accounts"
            fluid
            label="From"
            onChange={onChange}
            search
            selection
            state="addressFrom"
            options={keyringOptions}
          />
        </Form.Field>
        <Form.Field>
          <Input
            type="number"
            id="new_value"
            state="newValue"
            label="New Value"
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <TxButton
            api={api}
            fromPair={adminPair}
            label={"Store Something"}
            params={[newValue]}
            setStatus={setStatus}
            tx={api.tx.templateModule.doSomething}
            sudo={false}
          />
          {status}
        </Form.Field>
      </Form>
    </Grid.Column>
  );
}
