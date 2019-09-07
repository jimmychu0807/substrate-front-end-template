import React, { useEffect, useState } from "react";

import { Grid, Form, Dropdown, Input } from "semantic-ui-react";

import TxButton from "./TxButton";

export default function Metadata(props) {
  const { api, keyring } = props;

  const [modulesList, setModulesList] = useState([]);
  const [status, setStatus] = useState("");
  const [callableFunctionList, setCallableFunctionList] = useState([]);

  const initialState = {
    addressFrom: "",
    module: "",
    callableFunction: "",
    input: ""
  };
  const [formState, setFormState] = useState(initialState);
  const { addressFrom, module, callableFunction, input } = formState;
  const fromPair = !!addressFrom && keyring.getPair(addressFrom);

  // get the list of accounts we possess the private key for
  const keyringOptions = keyring.getPairs().map(account => ({
    key: account.address,
    value: account.address,
    text: account.meta.name.toUpperCase()
  }));

  useEffect(() => {
    let modules = Object.keys(api.tx)
      .sort()
      .map(module => ({
        key: module,
        value: module,
        text: module
      }));

    setModulesList(modules);
  }, [api]);

  useEffect(() => {
    if (module !== "") {
      let callableFunctions = Object.keys(api.tx[module])
        .sort()
        .map(callable => ({
          key: callable,
          value: callable,
          text: callable
        }));

      setCallableFunctionList(callableFunctions);
    }
  }, [api, module]);

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
      <h1>Extrinsics</h1>
      <Form>
        <Form.Field>
          <Dropdown
            placeholder="Select from  your accounts"
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
          <Dropdown
            placeholder="Select a module to call"
            fluid
            label="Module"
            onChange={onChange}
            search
            selection
            state="module"
            options={modulesList}
          />
        </Form.Field>
        <Form.Field>
          <Dropdown
            placeholder="Select a function to call"
            fluid
            label="Callable Function"
            onChange={onChange}
            search
            selection
            state="callableFunction"
            options={callableFunctionList}
          />
        </Form.Field>
        <Form.Field>
          <Input
            onChange={onChange}
            label="Input"
            fluid
            placeholder="May not be needed"
            state="input"
            type="text"
          />
        </Form.Field>
        <Form.Field>
          <TxButton
            api={api}
            fromPair={fromPair}
            label={"Call"}
            params={[input]}
            setStatus={setStatus}
            tx={api.tx && api.tx[module] && api.tx[module][callableFunction]}
          />
          {status}
        </Form.Field>
      </Form>
    </Grid.Column>
  );
}
