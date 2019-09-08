import React, { useEffect, useState } from "react";

import { Grid, Form, Dropdown, Button, Input } from "semantic-ui-react";

export default function ChainState(props) {
  const { api } = props;

  const [modulesList, setModulesList] = useState([]);
  const [output, setOutput] = useState("");
  const [storageItemsList, setStorageItemsList] = useState([]);

  const initialState = {
    module: "",
    storageItem: "",
    input: ""
  };
  const [formState, setFormState] = useState(initialState);
  const { module, storageItem, input } = formState;

  useEffect(() => {
    let modules = Object.keys(api.query).sort().map(module => ({
      key: module,
      value: module,
      text: module
    }));

    setModulesList(modules);
  }, [api]);

  useEffect(() => {
    if (module !== "") {
      let storageItems = Object.keys(api.query[module]).sort().map(storage => ({
        key: storage,
        value: storage,
        text: storage
      }));

      setStorageItemsList(storageItems);
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

  const runQuery = async () => {
    try {
      let result = await api.query[module][storageItem](input);
      setOutput(result.toString());
    } catch (e) {
		setOutput(e.toString())
	}
  };

  return (
    <Grid.Column>
      <h1>Chain State</h1>
      <Form>
        <Form.Field>
          <Dropdown
            placeholder="Select a module to query"
            fluid
            label="Module"
            onChange={onChange}
            search
            selection
            state="module"
            options={modulesList}
            value={module}
          />
        </Form.Field>
        <Form.Field>
          <Dropdown
            placeholder="Select a storage item to query"
            fluid
            label="Storage Item"
            onChange={onChange}
            search
            selection
            state="storageItem"
            options={storageItemsList}
            value={storageItem}
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
            value={input}
          />
        </Form.Field>
        <Form.Field>
          <Button onClick={runQuery} primary type="submit">
            Query
          </Button>{" "}
          {output}
        </Form.Field>
      </Form>
    </Grid.Column>
  );
}
