import React, { useState } from "react";
import { Form, Input, Grid } from "semantic-ui-react";

import TxButton from "./TxButton";

export default function Transfer(props) {
  const { api, accountPair } = props;
  const [status, setStatus] = useState("");
  const initialState = {
    addressTo: "",
    amount: 0
  };
  const [formState, setFormState] = useState(initialState);
  const { addressTo, amount } = formState;

  const onChange = (_, data) => {
    setFormState(formState => {
      return {
        ...formState,
        [data.state]: data.value
      };
    });
  };

  return (
    <Grid.Column>
      <h1>Transfer</h1>
      <Form>
        <Form.Field>
          <Input
            onChange={onChange}
            label="To"
            fluid
            placeholder="address"
            state="addressTo"
            type="text"
          />
        </Form.Field>
        <Form.Field>
          <Input
            label="Amount"
            fluid
            onChange={onChange}
            state="amount"
            type="number"
          />
        </Form.Field>
        <Form.Field>
          <TxButton
            api={api}
            accountPair={accountPair}
            label={"Send"}
            params={[addressTo, amount]}
            setStatus={setStatus}
            tx={api.tx.balances.transfer}
          />
          {status}
        </Form.Field>
      </Form>
    </Grid.Column>
  );
}
