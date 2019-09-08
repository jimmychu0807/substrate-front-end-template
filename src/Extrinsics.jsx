import React, { useEffect, useState } from "react";

import { Grid, Form, Dropdown, Input } from "semantic-ui-react";

import TxButton from "./TxButton";

export default function Extrinsics(props) {
  const { api, accountPair } = props;

  const [modulesList, setModulesList] = useState([]);
  const [status, setStatus] = useState("");
  const [callableFunctionList, setCallableFunctionList] = useState([]);

  const initialState = {
    module: "",
    callableFunction: "",
    input: ""
  };
  const [formState, setFormState] = useState(initialState);
  const { module, callableFunction, input } = formState;

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
            accountPair={accountPair}
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
