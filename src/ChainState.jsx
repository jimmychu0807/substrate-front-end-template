import React, { useEffect, useState } from "react";

import { Grid, Form, Dropdown, Button, Input } from "semantic-ui-react";

export default function Metadata(props) {
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
    let queries = api.query;
    let modules = Object.keys(queries).map(module => ({
      key: module,
      value: module,
      text: module
    }));

    setModulesList(modules);
  }, [api]);

  useEffect(() => {
    if (module !== "") {
      let queries = eval("api.query." + module + ".valueOf()");
      let storageItems = Object.keys(queries).map(storage => ({
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
    let result = await eval(
      "api.query." + module + "." + storageItem + "('" + input + "')"
    );
    setOutput(result.toString());
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
